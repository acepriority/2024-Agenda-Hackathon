
import React from 'react';
import './PredictionResult.css';

const PredictionResult = ({ prediction }) => {
  return (
    <div className="result-section">
      <h2>Prediction Result</h2>
      {prediction ? (
        <div>
          <p>Disease Detected: {prediction.diseaseName}</p>
          <p>Confidence: {prediction.confidence * 100}%</p>
          <p>{prediction.advice}</p>
        </div>
      ) : (
        <p>Loading your result...</p>
      )}
    </div>
  );
};

export default PredictionResult;
