from flask import Blueprint, request, jsonify # type: ignore
from services.ai_service import ai_service
from services.legal_data_service import legal_data_service

search_bp = Blueprint('search', __name__)

@search_bp.route('/query', methods=['POST'])
def search_query():
    data = request.get_json()
    query = data.get('query')
    user_id = data.get('user_id')
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    # Analyze query to determine intent (legal question or case law search)
    analysis = ai_service.analyze_query(query)
    
    # Generate a legal answer
    answer = ai_service.generate_legal_answer(query, user_id)
    
    # Search for relevant case law
    cases = legal_data_service.search_cases(query)
    
    return jsonify({
        "answer": answer,
        "analysis": analysis,
        "relevant_cases": cases[:5] if cases else []
    }) 