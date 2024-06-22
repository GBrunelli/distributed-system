import pandas as pd
import pymongo
import logging
import math

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define MongoDB connection details
mongodb_uri = "mongodb://your_mongo_host:27017/"
mongodb_database = "your_database"

# Function to create MongoDB client
def get_mongo_client(uri):
    try:
        client = pymongo.MongoClient(uri)
        logger.info("Successfully created MongoDB client.")
        return client
    except Exception as e:
        logger.error(f"Error creating MongoDB client: {e}")
        raise

# Function to insert laboratory records
def insert_laboratories(collection, laboratories):
    try:
        collection.insert_many(laboratories, ordered=False)
        logger.info("Successfully inserted laboratory records.")
    except pymongo.errors.BulkWriteError as e:
        logger.error(f"Error inserting laboratory records: {e.details}")

# Function to insert medicine records
def insert_medicines(collection, medicines):
    try:
        collection.insert_many(medicines, ordered=False)
        logger.info("Successfully inserted medicine records.")
    except pymongo.errors.BulkWriteError as e:
        logger.error(f"Error inserting medicine records: {e.details}")

# Function to run MongoDB transactions for laboratories in batches
def run_mongo_lab_transactions(laboratories, batch_size=100):
    client = get_mongo_client(mongodb_uri)
    db = client[mongodb_database]
    lab_collection = db["laboratories"]
    total_batches = math.ceil(len(laboratories) / batch_size)
    for i in range(total_batches):
        batch = laboratories[i * batch_size: (i + 1) * batch_size]
        insert_laboratories(lab_collection, batch)
    logger.info("Successfully created laboratory records in MongoDB.")
    client.close()

# Function to run MongoDB transactions for medicines in batches
def run_mongo_med_transactions(medicines, batch_size=100):
    client = get_mongo_client(mongodb_uri)
    db = client[mongodb_database]
    med_collection = db["medicines"]
    total_batches = math.ceil(len(medicines) / batch_size)
    for i in range(total_batches):
        batch = medicines[i * batch_size: (i + 1) * batch_size]
        insert_medicines(med_collection, batch)
    logger.info("Successfully created medicine records in MongoDB.")
    client.close()

# Read XLS file into a DataFrame
xls_file_path = "/app/xls_conformidade_site_20240604_162827951.xls"
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

# Run the transactions in batches
try:
    run_mongo_lab_transactions(unique_laboratories, batch_size=100)
    run_mongo_med_transactions(medicines, batch_size=100)
    logger.info("Data uploaded to MongoDB successfully!")
except Exception as e:
    logger.error(f"Error uploading data to MongoDB: {e}")
    raise
