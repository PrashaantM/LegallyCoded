import React, { useState } from "react";
import axios from "axios";

const DocumentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    agreementType: "NDA",
    terms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/generate-document", formData);
      alert("Document generated successfully!");
      console.log(res.data.document);
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  return (
    <div className="document-form">
      <h2>Generate Legal Document</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Agreement Type:
          <select name="agreementType" value={formData.agreementType} onChange={handleChange}>
            <option value="NDA">NDA</option>
            <option value="Employment">Employment Agreement</option>
          </select>
        </label>
        <label>
          Terms:
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Generate</button>
      </form>
    </div>
  );
};

export default DocumentForm;