import pandas as pd
from neo4j import GraphDatabase
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Neo4j connection details
neo4j_uri = "neo4j://neo4j-headless.neo4j.svc.cluster.local:7687"
neo4j_user = "neo4j"
neo4j_password = "bmVvNGo6bXlwYXNzd29yZA=="

# Function to create Neo4j driver
def get_neo4j_driver(uri, user, password):
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        logger.info("Successfully created Neo4j driver.")
        return driver
    except Exception as e:
        logger.error(f"Error creating Neo4j driver: {e}")
        raise

# Function to create nodes in Neo4j
def create_nodes(tx, rows):
    query = """
    UNWIND $rows AS row
    CREATE (n:YourLabe)
    """
    tx.run(query, rows=rows)

# Function to run Neo4j transactions
def run_neo4j_transactions(rows):
    driver = get_neo4j_driver(neo4j_uri, neo4j_user, neo4j_password)
    with driver.session() as session:
        session.write_transaction(create_nodes, rows)
    logger.info("Successfully ran Neo4j transactions.")

# Read XLS file into a DataFrame
xls_file_path = "/app/xls_conformidade_site_20240604_162827951.xls"
try:
    df = pd.read_excel(xls_file_path)
    logger.info("Successfully read XLS file into DataFrame.")
except Exception as e:
    logger.error(f"Error reading XLS file: {e}")
    raise

# Convert DataFrame rows to a list of dictionaries
rows = df.to_dict('records')

# Run the transaction
try:
    run_neo4j_transactions(rows)
    logger.info("Data uploaded to Neo4j successfully!")
except Exception as e:
    logger.error(f"Error uploading data to Neo4j: {e}")
    raise
