import os
import requests # type: ignore
from database.db import init_db, CaseSummary

db_session = init_db()

class LegalDataService:
    def __init__(self):
        # For demo purposes, we'll use the Harvard Caselaw Access Project API
        # You would need to register for an API key at https://case.law/user/register/
        self.case_law_api_key = os.getenv('CASE_LAW_API_KEY')
        self.case_law_api_url = "https://www.courtlistener.com/api/rest/v4/opinions/"
    
    def search_cases(self, query, jurisdiction=None, date_start=None, date_end=None, limit=10):
        """Search for cases matching the query"""
        # Check if we have cached results
        cached_cases = db_session.query(CaseSummary).filter(
            CaseSummary.case_name.like(f"%{query}%") | 
            CaseSummary.summary.like(f"%{query}%")
        ).limit(limit).all()
        
        if cached_cases:
            return [
                {
                    "id": case.id,
                    "case_name": case.case_name,
                    "citation": case.citation,
                    "summary": case.summary
                } for case in cached_cases
            ]
        
        # If no cached results or not enough, fetch from API
        params = {
            "search": query,
            "limit": limit
        }
        
        if jurisdiction:
            params["jurisdiction"] = jurisdiction
        
        if date_start:
            params["decision_date_min"] = date_start
        
        if date_end:
            params["decision_date_max"] = date_end
        
        headers = {}
        if self.case_law_api_key:
            headers["Authorization"] = f"Token {self.case_law_api_key}"
        
        try:
            response = requests.get(self.case_law_api_url, params=params, headers=headers)
            if response.status_code == 200:
                results = response.json().get("results", [])
                
                # Cache the results
                for case in results:
                    new_case = CaseSummary(
                        case_name=case.get("name", "Unnamed Case"),
                        citation=case.get("citations", [{"cite": "N/A"}])[0]["cite"],
                        summary=case.get("name_abbreviation", "") + ": " + case.get("decision_date", ""),
                        full_text=case.get("frontend_url", "")  # This is just a URL, not the full text
                    )
                    db_session.add(new_case)
                
                db_session.commit()
                
                return [
                    {
                        "id": None,  # Not from our DB
                        "case_name": case.get("name", "Unnamed Case"),
                        "citation": case.get("citations", [{"cite": "N/A"}])[0]["cite"],
                        "summary": case.get("name_abbreviation", "") + ": " + case.get("decision_date", "")
                    } for case in results
                ]
            else:
                print(f"API error: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            print(f"Error searching cases: {e}")
            return []
    
    def get_case_details(self, case_id):
        """Get detailed information about a specific case"""
        # First check our database
        case = db_session.query(CaseSummary).filter_by(id=case_id).first()
        
        if case and case.full_text:
            return {
                "id": case.id,
                "case_name": case.case_name,
                "citation": case.citation,
                "summary": case.summary,
                "full_text": case.full_text
            }
        
        # If not in database with full text, fetch from API
        try:
            response = requests.get(f"{self.case_law_api_url}{case_id}/")
            
            if response.status_code == 200:
                case_data = response.json()
                
                # For full text retrieval, you'd typically need to make another request
                # to the case's opinions endpoint
                full_text = "Full text not available"
                opinions_url = case_data.get("opinions_url")
                
                if opinions_url:
                    opinions_response = requests.get(opinions_url)
                    if opinions_response.status_code == 200:
                        opinions = opinions_response.json().get("results", [])
                        if opinions:
                            full_text = opinions[0].get("text", "Full text not available")
                
                # Update or create in database
                if case:
                    case.full_text = full_text
                    db_session.commit()
                    
                    return {
                        "id": case.id,
                        "case_name": case.case_name,
                        "citation": case.citation,
                        "summary": case.summary,
                        "full_text": full_text
                    }
                else:
                    return {
                        "id": None,
                        "case_name": case_data.get("name", "Unnamed Case"),
                        "citation": case_data.get("citations", [{"cite": "N/A"}])[0]["cite"],
                        "summary": case_data.get("name_abbreviation", "") + ": " + case_data.get("decision_date", ""),
                        "full_text": full_text
                    }
            else:
                print(f"API error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"Error getting case details: {e}")
            return None


# Initialize the legal data service as a singleton
legal_data_service = LegalDataService() 