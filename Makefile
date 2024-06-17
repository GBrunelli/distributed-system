start-kind:
	kind create cluster --name cluster --config=kind-config.yaml

start-argocd:
	@echo "Starting ArgoCD..."
	helm add repo
	@if [ -f "infrastructure/modules/argo-cd/charts/argo-cd-5.16.1.tgz" ]; then\
		echo "dependencies already exists";\
	else\
        helm dependency build ./infrastructure/modules/argo-cd;\
    fi
	helm repo add argo-cd https://argoproj.github.io/argo-helm
	helm dep update charts/argo-cd/
	helm install argo-cd -n argocd \
		--create-namespace ./infrastructure/modules/argo-cd

	sleep 5s
	kubectl wait --for=condition=ready --timeout=300s pod -l app.kubernetes.io/name=argocd-server -n argocd

start-apps:
	kubectl create namespace neo4j
	kubectl create secret generic neo4j-auth --namespace=neo4j --from-literal=NEO4J_AUTH=neo4j/bmVvNGo6bXlwYXNzd29yZA==
	kubectl apply -f infrastructure/app-of-apps/local/argo-cd.yaml


build-images:
	@echo "Building Images"
	docker build -t gbrunelli/neo4j_uploader:latest services/etl/.
	docker push gbrunelli/neo4j_uploader:latest
	docker build -t gbrunelli/dist_system_ui:latest services/ui/.
	docker push gbrunelli/dist_system_ui:latest

stop-kind:
	@echo "Stopping Kind..."
	kind delete clusters cluster

forward-ports:
	@echo "Forwarding Ports..."

	kubectl -n argocd port-forward svc/argo-cd-argocd-server 8080:443

get-info:
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo	

# Targets
up: start-kind start-argocd start-apps get-info
down: stop-kind

.PHONY: up down start-kind start-argocd start-apps start-kafka forward-ports stop-kind build-images