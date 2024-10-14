
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Upload.css';


const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.size < 50 * 1024 * 1024) { // 50 MB limit
      setSelectedFile(file);
      setProgress(0);
      setCompleted(false);
      simulateUpload(file.size);
    } else {
      alert('File is too large or unsupported.');
    }
  };

  const simulateUpload = (fileSize) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setCompleted(true);
      } else {
        progress += 5;
        setProgress(progress);
      }
    }, 300);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setCompleted(false);
  };

  const uploadFileToServer = () => {
    if (!selectedFile) {
      alert("No file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('/upload_file', { // Adjust to your server's URL
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('File successfully uploaded:', data);
      alert('File successfully uploaded!');
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    });
  };

  return (
    <div className="upload-section">
      <div 
           className="drag-area" 
           onClick={() => document.getElementById("file-input").click()}
           onDragOver={(e) => e.preventDefault()}
           onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
           }}
           role="button"
           aria-label="Click to select a file or drag and drop a file here"
           tabIndex={0}
           onKeyDown={(e) => e.key === 'Enter' && document.getElementById("file-input").click()}
           >
        <div className="upload-icon">
          <span className="material-icons">cloud_upload</span> {/* Icon added here */}
        </div>
        <div className="drag-area-text">
          <h3>Upload Your File</h3>
          <h4>Max 50MB - JPEG, PNG, SVG</h4>
        </div>
        <input type="file" id="file-input" hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>
      
      {selectedFile && (
        <div className="file-details">
          <p>File: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <button className="upload-button" onClick={uploadFileToServer}>Upload</button>
          <button className="remove-button" onClick={removeFile}>Remove</button>
        </div>
      )}

      {completed && (
        <div className="upload-success">
          <p>File upload completed!</p>
        </div>
      )}
    </div>
  );
};

export default Upload;