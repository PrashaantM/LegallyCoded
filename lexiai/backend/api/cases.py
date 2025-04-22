from flask import Blueprint, request, jsonify # type: ignore
from services.legal_data_service import legal_data_service

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('/search', methods=['GET'])
def search_cases():
    """Search for cases matching the query"""
    query = request.args.get('query')
    jurisdiction = request.args.get('jurisdiction')
    date_start = request.args.get('date_start')
    date_end = request.args.get('date_end')
    limit = request.args.get('limit', 10, type=int)
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    cases = legal_data_service.search_cases(
        query, 
        jurisdiction=jurisdiction,
        date_start=date_start,
        date_end=date_end,
        limit=limit
    )
    
    return jsonify(cases)

@cases_bp.route('/<int:case_id>', methods=['GET'])
def get_case_details(case_id):
    """Get detailed information about a specific case"""
    case = legal_data_service.get_case_details(case_id)
    
    if not case:
        return jsonify({"error": "Case not found"}), 404
    
    return jsonify(case) 