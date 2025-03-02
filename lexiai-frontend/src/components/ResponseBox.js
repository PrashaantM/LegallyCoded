import React from "react";

const ResponseBox = ({ response }) => {
  return (
    <div className="response-box">
      {response ? (
        <div className="response">{response}</div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResponseBox;
