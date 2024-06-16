# Use the official Python image
FROM python:3.9-slim

# Install necessary Python packages
RUN pip install pandas openpyxl neo4j xlrd

# Copy the Python script
COPY upload_to_neo4j.py /app/upload_to_neo4j.py

# Copy the XLS file
COPY xls_conformidade_site_20240604_162827951.xls /app/xls_conformidade_site_20240604_162827951.xls

# Set the working directory
WORKDIR /app

# Command to run the Python script
CMD ["python", "upload_to_neo4j.py"]
