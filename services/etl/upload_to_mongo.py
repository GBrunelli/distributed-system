import pymongo
from pymongo.errors import ServerSelectionTimeoutError

# Defina o URI do MongoDB com o endereço IP
mongodb_uri = "mongodb://192.168.1.100:27017/"

# Função para testar a conexão com o MongoDB
def test_mongo_connection(uri):
    try:
        # Crie um cliente MongoDB
        client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=5000)
        
        # Liste os bancos de dados disponíveis
        databases = client.list_database_names()
        print("Conexão bem-sucedida!")
        print("Bancos de dados disponíveis:")
        for db in databases:
            print(f"- {db}")
    except ServerSelectionTimeoutError as err:
        print(f"Erro ao conectar ao MongoDB: {err}")

# Teste a conexão com o MongoDB
test_mongo_connection(mongodb_uri)
