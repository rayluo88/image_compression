// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const previewArea = document.getElementById('previewArea');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('drop', handleDrop);
qualityRange.addEventListener('input', handleQualityChange);
downloadBtn.addEventListener('click', downloadCompressedImage);

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    processFile(file);
}

// Handle file drop
function handleDrop(e) {
    const file = e.dataTransfer.files[0];
    processFile(file);
}

function handleDragOver(e) {
    dropZone.classList.add('dragover');
}

// Process the selected file
function processFile(file) {
    if (!file.type.match('image.*')) {
        alert('Please upload an image file (PNG or JPG)');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
            displayOriginalImage(originalImage, file);
            compressImage(originalImage);
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Show preview area and hide upload area
    uploadArea.style.display = 'none';
    previewArea.style.display = 'block';
}

// Display original image and its size
function displayOriginalImage(image, file) {
    originalPreview.src = image.src;
    originalSize.textContent = formatFileSize(file.size);
}

// Compress image based on quality setting
function compressImage(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Maintain aspect ratio
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image on canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Compress and display
    const quality = qualityRange.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    compressedPreview.src = compressedDataUrl;
    
    // Calculate compressed size
    const base64str = compressedDataUrl.split(',')[1];
    const compressedSize = Math.round((base64str.length * 3) / 4);
    document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
}

// Handle quality slider change
function handleQualityChange(e) {
    qualityValue.textContent = `${e.target.value}%`;
    if (originalImage) {
        compressImage(originalImage);
    }
}

// Download compressed image
function downloadCompressedImage() {
    const link = document.createElement('a');
    link.download = 'compressed_image.jpg';
    link.href = compressedPreview.src;
    link.click();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add visual feedback for drag and drop
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('dragover');
}

function unhighlight(e) {
    dropZone.classList.remove('dragover');
} 