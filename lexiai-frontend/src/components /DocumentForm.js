import React, { useState } from "react";
import axios from "axios";

const DocumentForm = () => {
  const [documentType, setDocumentType] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState("");

  const handleDocumentSubmit = async () => {
    try {
      const res = await axios.post("/api/document", {
        document_type: documentType,
      });
      setGeneratedDocument(res.data.document);
    } catch (error) {
      setGeneratedDocument("Error generating the document.");
    }
  };

  return (
    <div className="document-form">
      <h2>Generate Legal Document</h2>
      <input
        type="text"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        placeholder="Enter document type (e.g., contract, will)"
      />
      <button onClick={handleDocumentSubmit}>Generate Document</button>
      {generatedDocument && <div className="response">{generatedDocument}</div>}
    </div>
  );
};

export default DocumentForm;
