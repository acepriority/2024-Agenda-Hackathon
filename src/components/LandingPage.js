
import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Crop Disease Predictor</h1>
      <p>Our tool helps farmers identify and prevent crop diseases with ease. Upload a photo and let us help you protect your crops!</p>
      <button onClick={() => window.location.href = '/upload'}>Get Started</button>
    </div>
  );
};

export default LandingPage;
