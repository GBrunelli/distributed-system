start-kind:
	kind create cluster --name cluster --config=kind-config.yaml

start-apps:
	kubectl create namespace mongo
	kubectl create namespace postgresql
	# kubectl apply -f infrastructure/app-of-apps/local/argo-cd.yaml
	# Substitua a linha acima com o deploy manual de seus aplicativos
	kubectl apply -f path/to/your/mongo-deployment.yaml
	kubectl apply -f path/to/your/postgresql-deployment.yaml

build-images:
	@echo "Building Images"
	docker build -t opaulosoares/mongo_uploader:latest services/etl/.
	docker push opaulosoares/mongo_uploader:latest
	docker build -t opaulosoares/dist_system_ui:latest services/ui/.
	docker push opaulosoares/dist_system_ui:latest

stop-kind:
	@echo "Stopping Kind..."
	kind delete clusters cluster

# Targets
up: start-kind start-apps
down: stop-kind

.PHONY: up down start-kind start-apps stop-kind build-images
