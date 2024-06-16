import pandas as pd
from neo4j import GraphDatabase

# Define Neo4j connection details
neo4j_uri = "neo4j://neo4j-headless.neo4j.svc.cluster.local:7687"
neo4j_user = "neo4j"
neo4j_password = "bmVvNGo6bXlwYXNzd29yZA=="

# Function to create Neo4j driver
def get_neo4j_driver(uri, user, password):
    return GraphDatabase.driver(uri, auth=(user, password))

# Function to create nodes in Neo4j
def create_nodes(tx, rows):
    query = """
    UNWIND $rows AS row
    CREATE (n:YourLabel)
    """
    tx.run(query, rows=rows)

# Function to run Neo4j transactions
def run_neo4j_transactions(rows):
    driver = get_neo4j_driver(neo4j_uri, neo4j_user, neo4j_password)
    with driver.session() as session:
        session.write_transaction(create_nodes, rows)

# Read XLS file into a DataFrame
xls_file_path = "xls_conformidade_site_20240604_162827951.xls"
df = pd.read_excel(xls_file_path)

# Convert DataFrame rows to a list of dictionaries
rows = df.to_dict('records')

# Run the transaction
run_neo4j_transactions(rows)

print("Data uploaded to Neo4j successfully!")
