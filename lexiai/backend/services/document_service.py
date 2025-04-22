import os
from jinja2 import Template # type: ignore
from database.db import init_db, Document
from services.ai_service import ai_service

db_session = init_db()

class DocumentService:
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
        self.document_types = {
            "nda": "Non-Disclosure Agreement",
            "employment_contract": "Employment Contract",
            "privacy_policy": "Privacy Policy",
            "terms_of_service": "Terms of Service",
            "cease_and_desist": "Cease and Desist Letter"
        }
    
    def get_document_types(self):
        """Get a list of available document types"""
        return [{"id": key, "name": value} for key, value in self.document_types.items()]
    
    def get_document_parameters(self, document_type):
        """Get required parameters for a specific document type"""
        # These parameters would be used to gather user input for document generation
        if document_type == "nda":
            return [
                {"id": "party_one", "name": "First Party Name", "required": True},
                {"id": "party_two", "name": "Second Party Name", "required": True},
                {"id": "confidential_info", "name": "Description of Confidential Information", "required": True},
                {"id": "effective_date", "name": "Effective Date", "required": True},
                {"id": "duration", "name": "Duration (in months)", "required": True},
                {"id": "governing_law", "name": "Governing Law (State/Country)", "required": True}
            ]
        elif document_type == "employment_contract":
            return [
                {"id": "employer", "name": "Employer Name", "required": True},
                {"id": "employee", "name": "Employee Name", "required": True},
                {"id": "position", "name": "Job Title/Position", "required": True},
                {"id": "start_date", "name": "Start Date", "required": True},
                {"id": "salary", "name": "Salary/Compensation", "required": True},
                {"id": "benefits", "name": "Benefits", "required": False},
                {"id": "termination", "name": "Termination Conditions", "required": False},
                {"id": "governing_law", "name": "Governing Law", "required": True}
            ]
        else:
            # For other document types, return generic parameters
            return [
                {"id": "title", "name": "Document Title", "required": True},
                {"id": "parties", "name": "Involved Parties", "required": True},
                {"id": "content", "name": "Additional Content/Instructions", "required": True}
            ]
    
    def generate_document(self, document_type, parameters, user_id=None):
        """Generate a legal document based on parameters"""
        # Check if document type exists
        document_name = self.document_types.get(document_type)
        if not document_name:
            return {"error": "Invalid document type"}
        
        # Validate required parameters
        required_params = [p["id"] for p in self.get_document_parameters(document_type) if p["required"]]
        for param in required_params:
            if param not in parameters or not parameters[param]:
                return {"error": f"Missing required parameter: {param}"}
        
        # Generate document using AI service
        document_content = ai_service.generate_document(document_name, parameters)
        
        # Save to database
        new_document = Document(
            user_id=user_id,
            title=f"{document_name} - {parameters.get('title', '')}",
            document_type=document_type,
            content=document_content
        )
        db_session.add(new_document)
        db_session.commit()
        
        return {
            "id": new_document.id,
            "title": new_document.title,
            "content": document_content
        }
    
    def get_user_documents(self, user_id):
        """Get all documents for a specific user"""
        documents = db_session.query(Document).filter_by(user_id=user_id).all()
        return [
            {
                "id": doc.id,
                "title": doc.title,
                "document_type": doc.document_type,
                "created_at": doc.created_at.isoformat()
            } for doc in documents
        ]
    
    def get_document(self, document_id, user_id=None):
        """Get a specific document"""
        query = db_session.query(Document).filter_by(id=document_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
            
        document = query.first()
        
        if not document:
            return None
        
        return {
            "id": document.id,
            "title": document.title,
            "document_type": document.document_type,
            "content": document.content,
            "created_at": document.created_at.isoformat()
        }


# Initialize the document service as a singleton
document_service = DocumentService() 