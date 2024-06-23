import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

engine = create_engine('postgresql+psycopg2://postgres:helloworld@postgresql.postgresql.svc.cluster.local:5432/distribuidos')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Define the models according to the ER diagram
class Paciente(Base):
    __tablename__ = 'paciente'
    id_paciente = Column(Integer, primary_key=True)
    nome = Column(String)
    cpf = Column(String)
    data_nascimento = Column(Date)
    endereco = Column(String)
    telefone = Column(String)
    prescricoes = relationship("Prescricao", back_populates="paciente")

class Medico(Base):
    __tablename__ = 'medico'
    id_medico = Column(Integer, primary_key=True)
    nome = Column(String)
    crm = Column(String)
    especialidade = Column(String)
    telefone = Column(String)
    email = Column(String)
    prescricoes = relationship("Prescricao", back_populates="medico")

class Prescricao(Base):
    __tablename__ = 'prescricao'
    id_prescricao = Column(Integer, primary_key=True)
    paciente_id = Column(Integer, ForeignKey('paciente.id_paciente'))
    medico_id = Column(Integer, ForeignKey('medico.id_medico'))
    data_prescricao = Column(Date)
    paciente = relationship("Paciente", back_populates="prescricoes")
    medico = relationship("Medico", back_populates="prescricoes")
    prescricao_medicamentos = relationship("PrescricaoMedicamento", back_populates="prescricao")

class Medicamento(Base):
    __tablename__ = 'medicamento'
    id_medicamento = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
    descricao = Column(String)
    fabricante_id = Column(Integer, ForeignKey('fabricante.id_fabricante'))
    data_registro_anvisa = Column(Date)
    codigo_anvisa = Column(String)
    codigo_ggrem = Column(String)  # Código GGREM
    classe_terapeutica = Column(String)  # Classe terapêutica
    ean1 = Column(String)  # EAN 1
    ean2 = Column(String)  # EAN 2
    ean3 = Column(String)  # EAN 3
    status_produto = Column(String)  # Status do produto
    regime_preco = Column(String)  # Regime de preço
    preco_minimo = Column(Float)  # Preço mínimo
    preco_maximo = Column(Float)  # Preço máximo
    restricao_hospitalar = Column(String)  # Restrição hospitalar
    tarja = Column(String)  # Tarja do medicamento
    destinacao_comercial = Column(String)  # Destinação comercial

    fabricante = relationship("Fabricante", back_populates="medicamentos")
    prescricao_medicamentos = relationship("PrescricaoMedicamento", back_populates="medicamento")
    medicamentos_disponiveis = relationship("MedicamentoDisponivel", back_populates="medicamento")

class Fabricante(Base):
    __tablename__ = 'fabricante'
    id_fabricante = Column(Integer, primary_key=True)
    nome = Column(String)
    cnpj = Column(String)
    endereco = Column(String)
    telefone = Column(String)
    medicamentos = relationship("Medicamento", back_populates="fabricante")

class PontoDistribuicao(Base):
    __tablename__ = 'ponto_distribuicao'
    id_ponto = Column(Integer, primary_key=True)
    nome = Column(String)
    tipo = Column(String)
    endereco = Column(String)
    telefone = Column(String)
    medicamentos_disponiveis = relationship("MedicamentoDisponivel", back_populates="ponto_distribuicao")

class PrescricaoMedicamento(Base):
    __tablename__ = 'prescricao_medicamento'
    id_prescricao = Column(Integer, ForeignKey('prescricao.id_prescricao'), primary_key=True)
    id_medicamento = Column(Integer, ForeignKey('medicamento.id_medicamento'), primary_key=True)
    quantidade_prescrita = Column(Integer)
    posologia = Column(String)
    prescricao = relationship("Prescricao", back_populates="prescricao_medicamentos")
    medicamento = relationship("Medicamento", back_populates="prescricao_medicamentos")

class MedicamentoDisponivel(Base):
    __tablename__ = 'medicamento_disponivel'
    id_disponibilidade = Column(Integer, primary_key=True, autoincrement=True)
    id_ponto = Column(Integer, ForeignKey('ponto_distribuicao.id_ponto'))
    id_medicamento = Column(Integer, ForeignKey('medicamento.id_medicamento'))
    quantidade_disponivel = Column(Integer)
    ponto_distribuicao = relationship("PontoDistribuicao", back_populates="medicamentos_disponiveis")
    medicamento = relationship("Medicamento", back_populates="medicamentos_disponiveis")

# Function to read data from XLSX
def read_xlsx(file_path):
    try:
        df = pd.read_excel(file_path, skiprows=52)  # Skip the first 52 rows to reach the header
        logger.info("Successfully read XLS file.")
        logger.info(f"Columns in DataFrame: {df.columns.tolist()}")
        return df
    except Exception as e:
        logger.error(f"Error reading XLS file: {e}")
        raise

# Function to create entries in PostgreSQL
def create_entries(df):
    try:
        # Handle NaN values: replace NaN with None
        df = df.where(pd.notnull(df), None)
        
        fabricantes = df[['CNPJ', 'LABORATÓRIO']].drop_duplicates().to_dict('records')
        for fab in fabricantes:
            fabricante = Fabricante(cnpj=fab['CNPJ'], nome=fab['LABORATÓRIO'])
            session.add(fabricante)
        session.commit()

        medicamentos = df.to_dict('records')
        for med in medicamentos:
            fabricante_id = session.query(Fabricante.id_fabricante).filter(Fabricante.cnpj == med['CNPJ']).one_or_none()
            if fabricante_id:
                # Replace NaT with None in 'data_registro_anvisa'
                data_registro_anvisa = pd.to_datetime(med['REGISTRO'], errors='coerce')
                if pd.isna(data_registro_anvisa):
                    data_registro_anvisa = None
                
                medicamento = Medicamento(
                    nome=med['PRODUTO'],
                    descricao=med['APRESENTAÇÃO'],
                    fabricante_id=fabricante_id.id_fabricante,
                    data_registro_anvisa=data_registro_anvisa,
                    codigo_anvisa=med['CÓDIGO GGREM'],
                    codigo_ggrem=med['CÓDIGO GGREM'],
                    classe_terapeutica=med['CLASSE TERAPÊUTICA'],
                    ean1=med['EAN 1'],
                    ean2=med['EAN 2'],
                    ean3=med['EAN 3'],
                    status_produto=med['TIPO DE PRODUTO (STATUS DO PRODUTO)'],
                    regime_preco=med['REGIME DE PREÇO'],
                    preco_minimo=med['PF Sem Impostos'],
                    preco_maximo=med['PMVG Sem Imposto'],
                    restricao_hospitalar=med['RESTRIÇÃO HOSPITALAR'],
                    tarja=med['TARJA'],
                    destinacao_comercial=med['DESTINAÇÃO COMERCIAL']
                )
                session.add(medicamento)
        session.commit()
        logger.info("Data uploaded to PostgreSQL successfully!")
    except Exception as e:
        logger.error(f"Error uploading data to PostgreSQL: {e}")
        session.rollback()
        raise

def main():

    xlsx_file_path = './xls_conformidade_gov_20240604_162827951.xls'  # Replace with the path to your XLSX file
    df = read_xlsx(xlsx_file_path)
    
    # Define columns to be used
    columns = [
        "SUBSTÂNCIA", "CNPJ", "LABORATÓRIO", "CÓDIGO GGREM", "REGISTRO", "EAN 1", "EAN 2", "EAN 3", "PRODUTO",
        "APRESENTAÇÃO", "CLASSE TERAPÊUTICA", "TIPO DE PRODUTO (STATUS DO PRODUTO)", "REGIME DE PREÇO",
        "PF Sem Impostos", "PMVG Sem Imposto", "RESTRIÇÃO HOSPITALAR", "CAP", "CONFAZ 87", "ICMS 0%",
        "ANÁLISE RECURSAL", "LISTA DE CONCESSÃO DE CRÉDITO TRIBUTÁRIO (PIS/COFINS)",
        "COMERCIALIZAÇÃO 2022", "TARJA", "DESTINAÇÃO COMERCIAL"
    ]

    # Ensure all columns are present
    df.columns = df.columns.str.strip()
    missing_columns = [col for col in columns if col not in df.columns]
    if missing_columns:
        logger.error(f"Missing columns in the DataFrame: {missing_columns}")
        raise KeyError(f"Missing columns: {missing_columns}")

    df = df[columns]
    create_entries(df)

if __name__ == "__main__":
    main()
