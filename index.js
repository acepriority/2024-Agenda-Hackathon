document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-input');
    const dragArea = document.getElementById('drag-area');
    const previewSection = document.getElementById('preview-section');
    const startCameraBtn = document.getElementById('start-camera');
    const cameraPreview = document.getElementById('camera-preview');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureImageBtn = document.getElementById('capture-image');
    const stopCameraBtn = document.getElementById('stop-camera');
    const cameraError = document.getElementById('camera-error');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadSuccess = document.getElementById('upload-success');
    const getStartedBtn = document.getElementById('get-started-btn');
    const landingPage = document.getElementById('landing-page');
    const uploadSection = document.getElementById('upload-section');
    const resultsSection = document.getElementById('results-section');
    const diseaseImg = document.getElementById('disease-img');
    const diseaseName = document.getElementById('disease-name');
    const diseaseProbability = document.getElementById('disease-probability');
    const diseaseDescription = document.getElementById('disease-description');
    const symptomsList = document.getElementById('symptoms-list');
    const treatmentList = document.getElementById('treatment-list');
    let selectedFiles = [];
  
    // Switch from landing page to upload section
    getStartedBtn.addEventListener('click', () => {
      landingPage.style.display = 'none';
      uploadSection.style.display = 'block';
    });
  
    // File input click and drag-drop functionality
    dragArea.addEventListener('click', () => fileInput.click());
  
    dragArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      dragArea.classList.add('active');
    });
  
    dragArea.addEventListener('dragleave', () => {
      dragArea.classList.remove('active');
    });
  
    dragArea.addEventListener('drop', (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      handleFiles(files);
      dragArea.classList.remove('active');
    });
  
    fileInput.addEventListener('change', (event) => {
      const files = event.target.files;
      handleFiles(files);
    });
  
    // Handle the selected or dropped files
    function handleFiles(files) {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          selectedFiles.push(file);
  
          const reader = new FileReader();
          reader.onload = function (event) {
            const imgElement = document.createElement('img');
            imgElement.src = event.target.result;
            imgElement.classList.add('preview-image');
  
            const previewItem = document.createElement('div');
            previewItem.classList.add('preview-item');
            previewItem.appendChild(imgElement);
  
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-file-btn');
            removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
            previewItem.appendChild(removeBtn);
  
            removeBtn.addEventListener('click', () => {
              previewItem.remove();
              selectedFiles = selectedFiles.filter(f => f !== file);
              if (selectedFiles.length === 0) {
                uploadBtn.style.display = 'none';
              }
            });
  
            previewSection.appendChild(previewItem);
          };
  
          reader.readAsDataURL(file);
        }
      }
  
      if (selectedFiles.length > 0) {
        uploadBtn.style.display = 'inline-block';
      }
    }
  
    // Camera functionality
    startCameraBtn.addEventListener('click', () => {
      cameraError.style.display = 'none';
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          cameraPreview.style.display = 'block';
          video.srcObject = stream;
          video.play();
        })
        .catch(() => {
          cameraError.style.display = 'block';
        });
    });
  
    captureImageBtn.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const imageFile = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
        handleFiles([imageFile]);
        stopCamera();
      });
    });
  
    stopCameraBtn.addEventListener('click', () => stopCamera());
  
    const stopCamera = () => {
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      video.srcObject = null;
      cameraPreview.style.display = 'none';
    };
  
     // Simulate file upload with progress
     uploadBtn.addEventListener('click', () => {
        progressContainer.style.display = 'block';
        uploadSuccess.style.display = 'none'; // Hide success message if already shown
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                progressContainer.style.display = 'none';
                uploadSuccess.style.display = 'block';
                selectedFiles = [];
                previewSection.innerHTML = '';
                uploadBtn.style.display = 'none';
                progressBar.style.width = '0%';
                
                // Simulate displaying the results with dummy data
                displayResults();
            }
        }, 300);
    });

    function displayResults() {
        // Hide the upload section
        uploadSection.style.display = 'none';
        
        // Show the results section
        resultsSection.style.display = 'block';

        // Populate the results section with dummy data
        diseaseImg.src = 'https://via.placeholder.com/200'; // Replace with actual image URL
        diseaseName.textContent = 'Banana Bacterial Wilt';
        diseaseProbability.textContent = 'Probability: 98%';
        diseaseDescription.textContent = 'Banana Bacterial Wilt is a devastating disease affecting banana plants. It is caused by a bacterial pathogen and spreads rapidly under favorable conditions.';

        symptomsList.innerHTML = `
            <tr><td>1.</td><td>Yellowing of leaves.</td></tr>
            <tr><td>2.</td><td>Wilting of plants.</td></tr>
            <tr><td>3.</td><td>Premature fruit ripening.</td></tr>
        `;

        treatmentList.innerHTML = `
            <tr><td>1.</td><td>Remove and destroy infected plants immediately.</td></tr>
            <tr><td>2.</td><td>Disinfect tools between fields.</td></tr>
            <tr><td>3.</td><td>Avoid planting susceptible varieties.</td></tr>
        `;
    }
});