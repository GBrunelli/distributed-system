# Use the official Spark image
FROM bitnami/spark:latest

# Install necessary Python packages
RUN pip install pandas openpyxl neo4j

# Copy the Spark script
COPY spark_neo4j.py /app/spark_neo4j.py

# Copy the XLS file (assuming it's in the same directory as Dockerfile)
COPY xls_conformidade_site_20240604_162827951.xls /app/xls_conformidade_site_20240604_162827951.xls

# Set the working directory
WORKDIR /app

# Command to run the Spark job
CMD ["spark-submit", "spark_neo4j.py"]
