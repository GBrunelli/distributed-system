from pyspark.sql import SparkSession
from pyspark.sql.functions import lit
import pandas as pd
from neo4j import GraphDatabase

# Initialize Spark session
spark = SparkSession.builder \
    .appName("XLS to Neo4j") \
    .getOrCreate()

# Read XLS file into a DataFrame
xls_file_path = "/path/to/your/file.xls"
df = pd.read_excel(xls_file_path)

# Convert Pandas DataFrame to Spark DataFrame
spark_df = spark.createDataFrame(df)

# Define Neo4j connection details
neo4j_uri = "bolt://test:7687"
neo4j_user = "neo4j"
neo4j_password = "password"

# Function to create Neo4j driver
def get_neo4j_driver(uri, user, password):
    return GraphDatabase.driver(uri, auth=(user, password))

# Function to create nodes in Neo4j
def create_nodes(tx, rows):
    query = """
    UNWIND $rows AS row
    CREATE (n:YourLabel {field1: row.field1, field2: row.field2, ...})
    """
    tx.run(query, rows=rows.to_dict('records'))

# Function to run Neo4j transactions
def run_neo4j_transactions(rows):
    driver = get_neo4j_driver(neo4j_uri, neo4j_user, neo4j_password)
    with driver.session() as session:
        session.write_transaction(create_nodes, rows)

# Run the transaction
rows = spark_df.collect()
run_neo4j_transactions(rows)

spark.stop()
