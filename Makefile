start-kind:
	kind create cluster --name cluster --config=kind-config.yaml

start-argocd:
	@echo "Starting ArgoCD..."
	
	@if [ -f "infrastructure/modules/argo-cd/charts/argo-cd-5.16.1.tgz" ]; then\
		echo "dependencies already exists";\
	else\
        helm dependency build ./infrastructure/modules/argo-cd;\
    fi

	helm install argo-cd -n argocd \
		--create-namespace ./infrastructure/modules/argo-cd

	sleep 5s
	kubectl wait --for=condition=ready --timeout=300s pod -l app.kubernetes.io/name=argocd-server -n argocd

	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

start-apps:
	kubectl create secret generic neo4j-auth --namespace=neo4j --from-literal=NEO4J_AUTH=neo4j/bmVvNGo6bXlwYXNzd29yZA==
	kubectl apply -f infrastructure/app-of-apps/local/argo-cd.yaml

stop-kind:
	@echo "Stopping Kind..."
	kind delete clusters cluster

forward-ports:
	@echo "Forwarding Ports..."

	kubectl -n argocd port-forward svc/argo-cd-argocd-server 8080:443
	
# Targets
up: start-kind start-argocd
down: stop-kind

.PHONY: up down start-kind start-argocd start-apps start-kafka forward-ports stop-kind