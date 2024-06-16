import pandas as pd
from neo4j import GraphDatabase
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Neo4j connection details
neo4j_uri = "neo4j://localhost:7687"
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

# Function to create Laboratory nodes in Neo4j
def create_laboratory_nodes(tx, laboratories):
    query = """
    UNWIND $laboratories AS lab
    CALL {
        MERGE (l:Laboratory {CNPJ: lab.CNPJ})
        ON CREATE SET l.name = lab.LABORATÓRIO
    } IN TRANSACTIONS
    """
    tx.run(query, laboratories=laboratories)

# Function to create Medicine nodes and relationships in Neo4j
def create_medicine_nodes(tx, medicines):
    query = """
    UNWIND $medicines AS med
    CALL {
        MERGE (l:Laboratory {CNPJ: med.CNPJ})
        CREATE (m:Medicine)
        SET m = med
        MERGE (m)-[:PRODUCED_BY]->(l)
    } IN TRANSACTIONS
    """
    tx.run(query, medicines=medicines)

# Function to run Neo4j transactions for laboratories
def run_neo4j_lab_transactions(laboratories):
    driver = get_neo4j_driver(neo4j_uri, neo4j_user, neo4j_password)
    with driver.session() as session:
        session.write_transaction(create_laboratory_nodes, laboratories)
    logger.info("Successfully created laboratory nodes in Neo4j.")

# Function to run Neo4j transactions for medicines
def run_neo4j_med_transactions(medicines):
    driver = get_neo4j_driver(neo4j_uri, neo4j_user, neo4j_password)
    with driver.session() as session:
        session.write_transaction(create_medicine_nodes, medicines)
    logger.info("Successfully created medicine nodes and relationships in Neo4j.")

# Read XLS file into a DataFrame
xls_file_path = "xls_conformidade_site_20240604_162827951.xls"
try:
    df = pd.read_excel(xls_file_path, skiprows=41)  # Skip the first 41 rows
    df.columns = df.columns.str.strip()  # Strip any leading/trailing spaces from column names
    logger.info("Successfully read XLS file into DataFrame.")
except Exception as e:
    logger.error(f"Error reading XLS file: {e}")
    raise

# Specify the columns to be read
columns = [
    "SUBSTÂNCIA", "CNPJ", "LABORATÓRIO", "CÓDIGO GGREM", "REGISTRO", "EAN 1", "EAN 2", "PRODUTO",
    "APRESENTAÇÃO", "CLASSE TERAPÊUTICA", "TIPO DE PRODUTO (STATUS DO PRODUTO)", "REGIME DE PREÇO",
    "PF Sem Impostos", "PF 0%", "PF 12%", "PF 12% ALC", "PF 17%", "PF 17% ALC", "PF 17,5%", 
    "PF 17,5% ALC", "PF 18%", "PF 18% ALC", "PF 19%", "PF 19% ALC", "PF 19,5%", "PF 19,5% ALC",
    "PF 20%", "PF 20% ALC", "PF 20,5%", "PF 21%", "PF 21% ALC", "PF 22%", "PF 22% ALC",
    "PMC Sem Imposto", "PMC 0%", "PMC 12%", "PMC 12% ALC", "PMC 17%", "PMC 17% ALC", "PMC 17,5%",
    "PMC 17,5% ALC", "PMC 18%", "PMC 18% ALC", "PMC 19%", "PMC 19% ALC", "PMC 19,5%", 
    "PMC 19,5% ALC", "PMC 20%", "PMC 20% ALC", "PMC 20,5%", "PMC 21%", "PMC 21% ALC", 
    "PMC 22%", "PMC 22% ALC", "RESTRIÇÃO HOSPITALAR", "CAP", "CONFAZ 87", "ICMS 0%",
    "ANÁLISE RECURSAL", "LISTA DE CONCESSÃO DE CRÉDITO TRIBUTÁRIO (PIS/COFINS)",
    "COMERCIALIZAÇÃO 2022", "TARJA", "DESTINAÇÃO COMERCIAL"
]

# Check if all columns exist in the DataFrame, strip any leading/trailing spaces
df.columns = df.columns.str.strip()
missing_columns = [col for col in columns if col not in df.columns]
if missing_columns:
    logger.error(f"Missing columns in the DataFrame: {missing_columns}")
    raise KeyError(f"Missing columns: {missing_columns}")

df = df[columns]

# Create list of unique laboratories
unique_laboratories = df[['CNPJ', 'LABORATÓRIO']].drop_duplicates().to_dict('records')

# Convert DataFrame rows to a list of dictionaries for medicines
medicines = df.to_dict('records')

# Run the transactions
try:
    run_neo4j_lab_transactions(unique_laboratories)
    run_neo4j_med_transactions(medicines)
    logger.info("Data uploaded to Neo4j successfully!")
except Exception as e:
    logger.error(f"Error uploading data to Neo4j: {e}")
    raise
