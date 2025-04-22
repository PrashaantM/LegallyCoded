from flask import Blueprint, request, jsonify # type: ignore
from services.document_service import document_service

documents_bp = Blueprint('documents', __name__)

@documents_bp.route('/types', methods=['GET'])
def get_document_types():
    """Get all available document types"""
    return jsonify(document_service.get_document_types())

@documents_bp.route('/parameters/<document_type>', methods=['GET'])
def get_document_parameters(document_type):
    """Get parameters required for a specific document type"""
    params = document_service.get_document_parameters(document_type)
    return jsonify(params)

@documents_bp.route('/generate', methods=['POST'])
def generate_document():
    """Generate a document based on parameters"""
    data = request.get_json()
    document_type = data.get('document_type')
    parameters = data.get('parameters', {})
    user_id = data.get('user_id')
    
    if not document_type:
        return jsonify({"error": "Document type not provided"}), 400
    
    result = document_service.generate_document(document_type, parameters, user_id)
    
    if "error" in result:
        return jsonify(result), 400
    
    return jsonify(result), 201

@documents_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_documents(user_id):
    """Get all documents for a user"""
    documents = document_service.get_user_documents(user_id)
    return jsonify(documents)

@documents_bp.route('/<int:document_id>', methods=['GET'])
def get_document(document_id):
    """Get a specific document"""
    user_id = request.args.get('user_id', type=int)
    document = document_service.get_document(document_id, user_id)
    
    if not document:
        return jsonify({"error": "Document not found"}), 404
    
    return jsonify(document) 