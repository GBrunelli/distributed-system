from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

class Paciente(Base):
    __tablename__ = 'paciente'
    id_paciente = Column(Integer, primary_key=True)
    nome = Column(String)
    cpf = Column(String)
    data_nascimento = Column(Date)
    endereco = Column(String)
    telefone = Column(String)
    prescricao = relationship("Prescricao", back_populates="paciente")

class Medico(Base):
    __tablename__ = 'medico'
    id_medico = Column(Integer, primary_key=True)
    nome = Column(String)
    crm = Column(String)
    especialidade = Column(String)
    telefone = Column(String)
    email = Column(String)
    prescricao = relationship("Prescricao", back_populates="medico")

class Prescricao(Base):
    __tablename__ = 'prescricao'
    id_prescricao = Column(Integer, primary_key=True)
    paciente_id = Column(Integer, ForeignKey('paciente.id_paciente'))
    medico_id = Column(Integer, ForeignKey('medico.id_medico'))
    data_prescricao = Column(Date)
    paciente = relationship("Paciente", back_populates="prescricao")
    medico = relationship("Medico", back_populates="prescricao")
    prescricao_medicamento = relationship("PrescricaoMedicamento", back_populates="prescricao")

class Medicamento(Base):
    __tablename__ = 'medicamento'
    id_medicamento = Column(Integer, primary_key=True)
    nome = Column(String)
    descricao = Column(String)
    fabricante_id = Column(Integer, ForeignKey('fabricante.id_fabricante'))
    data_registro_anvisa = Column(Date)
    codigo_anvisa = Column(String)
    fabricante = relationship("Fabricante", back_populates="medicamento")
    prescricao_medicamento = relationship("PrescricaoMedicamento", back_populates="medicamento")
    medicamento_disponivel = relationship("MedicamentoDisponivel", back_populates="medicamento")

class Fabricante(Base):
    __tablename__ = 'fabricante'
    id_fabricante = Column(Integer, primary_key=True)
    nome = Column(String)
    cnpj = Column(String)
    endereco = Column(String)
    telefone = Column(String)
    medicamento = relationship("Medicamento", back_populates="fabricante")

class PontoDistribuicao(Base):
    __tablename__ = 'ponto_distribuicao'
    id_ponto = Column(Integer, primary_key=True)
    nome = Column(String)
    tipo = Column(String)
    endereco = Column(String)
    telefone = Column(String)
    medicamento_disponivel = relationship("MedicamentoDisponivel", back_populates="ponto_distribuicao")

class PrescricaoMedicamento(Base):
    __tablename__ = 'prescricao_medicamento'
    id_prescricao = Column(Integer, ForeignKey('prescricao.id_prescricao'), primary_key=True)
    id_medicamento = Column(Integer, ForeignKey('medicamento.id_medicamento'), primary_key=True)
    quantidade_prescrita = Column(Integer)
    posologia = Column(String)
    prescricao = relationship("Prescricao", back_populates="prescricao_medicamento")
    medicamento = relationship("Medicamento", back_populates="prescricao_medicamento")

class MedicamentoDisponivel(Base):
    __tablename__ = 'medicamento_disponivel'
    id_disponibilidade = Column(Integer, primary_key=True)
    id_ponto = Column(Integer, ForeignKey('ponto_distribuicao.id_ponto'))
    id_medicamento = Column(Integer, ForeignKey('medicamento.id_medicamento'))
    quantidade_disponivel = Column(Integer)
    ponto_distribuicao = relationship("PontoDistribuicao", back_populates="medicamento_disponivel")
    medicamento = relationship("Medicamento", back_populates="medicamento_disponivel")

def main():
    engine = create_engine('postgresql+psycopg2://postgres:helloworld@localhost/distribuidos')
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    # Adicione alguns dados de exemplo aqui, se necessário
    paciente = Paciente(nome="João", cpf="12345678901", data_nascimento="2000-01-01", endereco="Rua A", telefone="12345678")
    session.add(paciente)
    session.commit()

if __name__ == "__main__":
    main()
