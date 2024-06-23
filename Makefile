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
	--create-namespace ./infrastructure/modules/argo-cd \
	--debug

	sleep 5s
	kubectl wait --for=condition=ready --timeout=300s pod -l app.kubernetes.io/name=argocd-server -n argocd --v=6

start-apps:
	kubectl create namespace postgre
	kubectl create namespace postgresql
	kubectl create namespace backend
	kubectl create namespace kafka
	kubectl apply -f infrastructure/app-of-apps/local/argo-cd.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/zookeeper.yaml

build-images:
	@echo "Building Images"
	docker build -t opaulosoares/postgre_uploader:latest services/etl/.
	docker push opaulosoares/postgre_uploader:latest
	docker build -t opaulosoares/dist_system_ui:latest services/ui/.
	docker push opaulosoares/dist_system_ui:latest
	docker build -t opaulosoares/dist_system_backend:latest services/backend/.
	docker push opaulosoares/dist_system_backend:latest

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

.PHONY: up down start-kind start-argocd start-apps forward-ports stop-kind build-images
