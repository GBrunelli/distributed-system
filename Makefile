# Diretórios dos projetos frontend e backend
NODE_UI_PROJECT_DIR=services/ui
NODE_BACKEND_PROJECT_DIR=services/backend

# Arquivos de sinalização para frontend e backend
FLAG_FILE_UI=$(NODE_UI_PROJECT_DIR)/node_modules/.dependencies_installed
FLAG_FILE_BACKEND=$(NODE_BACKEND_PROJECT_DIR)/node_modules/.dependencies_installed

# Target para instalar dependências do frontend
install-frontend-dependencies:
	@echo "Checking frontend dependencies in $(NODE_UI_PROJECT_DIR)"
	cd $(NODE_UI_PROJECT_DIR) && npm install;

# Target para instalar dependências do backend
install-backend-dependencies:
	@echo "Checking backend dependencies in $(NODE_BACKEND_PROJECT_DIR)"
	cd $(NODE_BACKEND_PROJECT_DIR) && npm install;

# Target para construir o frontend
build-frontend:
	@echo "Building frontend project in $(NODE_UI_PROJECT_DIR)"
	cd $(NODE_UI_PROJECT_DIR) && npm run build

install-docker:
	sudo apt-get update
	sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
	sudo apt-get update
	sudo apt-get install -y docker-ce
	sudo usermod -aG docker ${USER}


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
	--values ./infrastructure/modules/argo-cd/values.yaml \
	--debug

	sleep 5s
	kubectl wait --for=condition=ready --timeout=600s pod -l app.kubernetes.io/name=argocd-server -n argocd --v=6

# Iniciar e aplicar as configurações das aplicações
start-apps:
	kubectl create namespace postgre
	kubectl create namespace postgresql
	kubectl create namespace backend
	kubectl create namespace kafka
	kubectl apply -f infrastructure/app-of-apps/local/argo-cd.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/zookeeper.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/backend.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/etl.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/kafka.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/postgresql.yaml
	kubectl apply -f infrastructure/app-of-apps/apps/ui.yaml



# Iniciar e configurar Prometheus e Grafana para monitoramento
start-monitoring:
	kubectl create namespace monitoring
	@if ! helm status prometheus -n monitoring > /dev/null 2>&1; then\
		helm install prometheus prometheus-community/prometheus -f infrastructure/modules/prometheus/values.yaml --namespace monitoring;\
	else\
		echo "Prometheus already installed";\
	fi
	helm repo add grafana https://grafana.github.io/helm-charts
	helm repo update
	@if ! helm status grafana -n monitoring > /dev/null 2>&1; then\
		helm install grafana grafana/grafana -f infrastructure/modules/grafana/values-secret.yaml --namespace monitoring;\
	else\
		echo "Grafana already installed";\
	fi

	kubectl apply -f infrastructure/modules/prometheus/prometheus-server-pvc.yaml

	sleep 5s
	kubectl wait --for=condition=ready --timeout=600s pod -l app.kubernetes.io/name=grafana -n monitoring --v=6

# Construir imagens Docker para os serviços
# docker push opaulosoares/dist_system_ui:latest 
build-images:
	@echo "Building Images"
	docker build -t opaulosoares/postgre_uploader:latest services/etl/.
	docker build -t opaulosoares/dist_system_ui:latest services/ui/.
	docker build -t opaulosoares/dist_system_backend:latest services/backend/.

# Parar e deletar o cluster KIND
stop-kind:
	@echo "Stopping Kind..."
	kind delete cluster --name cluster

# Encaminhar portas para acessar o ArgoCD, Grafana
forward-ports:
	@echo "Forwarding Ports..."
	-kubectl -n argocd port-forward svc/argo-cd-argocd-server 30084:443 &
	-kubectl -n monitoring port-forward svc/grafana 30083:80
	
# Obter informações de acesso (senhas) para ArgoCD e Grafana
get-info:
	@echo "----------------------"
	@echo "ArgoCD admin password:"
	@kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode; echo
	@echo "----------------------"
	@echo "Grafana admin password:"
	@kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode; echo
	@echo "----------------------"

# Targets para iniciar e parar todo o sistema
init: install-frontend-dependencies install-backend-dependencies build-frontend build-images
up: start-kind start-argocd start-apps start-monitoring get-info
down: stop-kind

.PHONY: up down start-kind start-argocd start-apps start-monitoring forward-ports stop-kind build-images get-info create-prometheus-pvc
