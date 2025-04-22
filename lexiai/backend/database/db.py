from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore
from sqlalchemy.orm import sessionmaker # type: ignore
import datetime
import os

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CaseSummary(Base):
    __tablename__ = 'case_summaries'
    
    id = Column(Integer, primary_key=True)
    case_name = Column(String(200), nullable=False)
    citation = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    full_text = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserQuery(Base):
    __tablename__ = 'user_queries'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=True)
    query_text = Column(Text, nullable=False)
    response = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Document(Base):
    __tablename__ = 'documents'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=True)
    title = Column(String(200), nullable=False)
    document_type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    db_path = os.getenv('DATABASE_PATH', 'sqlite:///lexiai.db')
    engine = create_engine(db_path)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session() 