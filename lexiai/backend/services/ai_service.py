import os
from openai import OpenAI # type: ignore
from google.cloud import language_v1
from database.db import init_db, UserQuery
import json
from dotenv import load_dotenv # type: ignore

# Load environment variables
load_dotenv()

db_session = init_db()

class AIService:
    def __init__(self):
        # Read API key from environment variable instead of hardcoding
        openai_api_key = os.getenv('OPENAI_API_KEY')
        self.openai_client = OpenAI(api_key=openai_api_key)
        
        # Google NLP setup (requires GOOGLE_APPLICATION_CREDENTIALS env var to be set)
        try:
            print(f"Google credentials path: {os.getenv('GOOGLE_APPLICATION_CREDENTIALS')}")
            # Verify that the file exists
            creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if creds_path and os.path.exists(creds_path):
                print(f"Credentials file exists at: {creds_path}")
                # Try to load the JSON to validate it
                try:
                    with open(creds_path, 'r') as f:
                        json.load(f)
                    print("Credentials file contains valid JSON")
                except json.JSONDecodeError:
                    print("Credentials file contains invalid JSON")
            else:
                print(f"Credentials file does not exist at: {creds_path}")
                
            # Initialize the client
            self.nlp_client = language_v1.LanguageServiceClient()
            print("Google NLP client initialized successfully")
        except Exception as e:
            print(f"Google NLP client initialization failed: {e}")
            self.nlp_client = None
    
    def analyze_query(self, query_text):
        """Analyze the query using Google NLP to determine the legal domain and entities"""
        if not self.nlp_client:
            return {"domain": "unknown", "entities": []}
        
        document = language_v1.Document(
            content=query_text,
            type_=language_v1.Document.Type.PLAIN_TEXT
        )
        
        try:
            # Entity analysis
            entities = self.nlp_client.analyze_entities(
                document=document
            ).entities
            
            # Content classification
            categories = self.nlp_client.classify_text(
                document=document
            ).categories
            
            return {
                "domain": categories[0].name if categories else "unknown",
                "entities": [{"name": entity.name, "type": language_v1.Entity.Type(entity.type_).name} 
                            for entity in entities]
            }
        except Exception as e:
            print(f"Google NLP analysis failed: {e}")
            return {"domain": "unknown", "entities": []}
    
    def generate_legal_answer(self, query_text, user_id=None):
        """Generate a legal answer using OpenAI GPT"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are LexiAI, a legal assistant specialized in providing accurate legal information. Only answer questions related to legal matters."},
                    {"role": "user", "content": query_text}
                ],
                max_tokens=1500
            )
            
            answer = response.choices[0].message.content
            
            # Save query to database
            new_query = UserQuery(
                user_id=user_id,
                query_text=query_text,
                response=answer
            )
            db_session.add(new_query)
            db_session.commit()
            
            return answer
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return "I'm sorry, I couldn't process your legal query at this time."
    
    def generate_document(self, document_type, parameters):
        """Generate a legal document based on user parameters"""
        prompt = f"Create a {document_type} with the following details:\n"
        for key, value in parameters.items():
            prompt += f"{key}: {value}\n"
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a legal document drafting assistant. Generate professional and legally sound documents based on the provided parameters."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2500
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"Document generation error: {e}")
            return "Error generating document"


# Initialize the AI service as a singleton
ai_service = AIService() 