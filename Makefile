# Criar cluster KIND com a configuração especificada
start-kind:
	kind create cluster --name cluster --config=kind-config.yaml

# Iniciar e configurar o ArgoCD
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

# Iniciar e aplicar as configurações das aplicações
start-apps:
	kubectl create namespace postgre || true
	kubectl create namespace postgresql || true
	kubectl create namespace backend || true
	kubectl create namespace kafka || true
	kubectl apply -f infrastructure/app-of-apps/local/argo-cd.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/zookeeper.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/backend.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/etl.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/kafka.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/postgresql.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/ui.yaml



# Iniciar e configurar Prometheus e Grafana para monitoramento
start-monitoring:
	kubectl create namespace monitoring || true
	@if ! helm status prometheus -n monitoring > /dev/null 2>&1; then\
		helm install prometheus prometheus-community/prometheus -f infrastructure/modules/prometheus/values.yaml --namespace monitoring;\
	else\
		echo "Prometheus already installed";\
	fi
	helm repo add grafana https://grafana.github.io/helm-charts || true
	helm repo update
	@if ! helm status grafana -n monitoring > /dev/null 2>&1; then\
		helm install grafana grafana/grafana -f infrastructure/modules/grafana/values-secret.yaml --namespace monitoring;\
	else\
		echo "Grafana already installed";\
	fi

	kubectl apply -f infrastructure/modules/prometheus/prometheus-server-pvc.yaml

# Construir e enviar imagens Docker para os serviços
build-images:
	@echo "Building Images"
	docker build -t opaulosoares/postgre_uploader:latest services/etl/.
	docker push opaulosoares/postgre_uploader:latest
	docker build -t opaulosoares/dist_system_ui:latest services/ui/.
	docker push opaulosoares/dist_system_ui:latest
	docker build -t opaulosoares/dist_system_backend:latest services/backend/.
	docker push opaulosoares/dist_system_backend:latest

# Parar e deletar o cluster KIND
stop-kind:
	@echo "Stopping Kind..."
	kind delete cluster --name cluster

# Encaminhar portas para acessar o ArgoCD, Grafana, frontend, backend
forward-ports:
	@echo "Forwarding Ports..."
	-kubectl -n argocd port-forward svc/argo-cd-argocd-server 8080:443 &
	-kubectl -n monitoring port-forward svc/grafana 8081:80

# Obter informações de acesso (senhas) para ArgoCD e Grafana
get-info:
	@echo "ArgoCD admin password:"
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode; echo
	@echo "Grafana admin password:"
	kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode; echo

# Targets para iniciar e parar todo o sistema
up: start-kind start-argocd start-apps start-monitoring forward-ports get-info
down: stop-kind

.PHONY: up down start-kind start-argocd start-apps start-monitoring forward-ports stop-kind build-images get-info create-prometheus-pvc
