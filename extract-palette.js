document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const uploadContainer = document.getElementById('upload-container');
    const extractBtn = document.getElementById('extract-btn');
    const extractedPaletteContainer = document.getElementById('extracted-palette-container');
    const extractedPalette = document.getElementById('extracted-palette');
    const colorCount = document.getElementById('color-count');
    const colorCountValue = document.getElementById('color-count-value');
    const savePaletteBtn = document.getElementById('save-palette');
    const copyPaletteBtn = document.getElementById('copy-palette');
    const tryAgainBtn = document.getElementById('try-again');
    
    // Initialize ColorThief
    const colorThief = new ColorThief();
    
    // Event Listeners
    uploadArea.addEventListener('click', () => imageUpload.click());
    uploadBtn.addEventListener('click', () => imageUpload.click());
    
    // Update color count value display
    colorCount.addEventListener('input', () => {
        colorCountValue.textContent = colorCount.value;
    });
    
    // Handle file upload
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Extract colors button
    extractBtn.addEventListener('click', extractColors);
    
    // Try again button
    tryAgainBtn.addEventListener('click', resetUI);
    
    // Save palette button
    savePaletteBtn.addEventListener('click', savePalette);
    
    // Copy colors button
    copyPaletteBtn.addEventListener('click', copyColors);
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            imageUpload.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });
    
    // Functions
    function handleImageUpload() {
        const file = imageUpload.files[0];
        
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                uploadContainer.style.display = 'none';
                imagePreviewContainer.style.display = 'block';
                
                // Pre-load the image for ColorThief
                imagePreview.onload = function() {
                    // Auto-extract colors if image is loaded
                    extractColors();
                };
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    function extractColors() {
        try {
            // Make sure the image is loaded
            if (!imagePreview.complete) {
                imagePreview.onload = extractColors;
                return;
            }
            
            // Get the palette
            const count = parseInt(colorCount.value);
            const palette = colorThief.getPalette(imagePreview, count);
            
            // Display the palette
            displayPalette(palette);
            
            // Show the extracted palette container
            extractedPaletteContainer.style.display = 'block';
            
            // Make palette sortable
            new Sortable(extractedPalette, {
                animation: 150,
                ghostClass: 'sortable-ghost'
            });
        } catch (error) {
            console.error('Error extracting colors:', error);
            alert('Error extracting colors. Please try a different image.');
        }
    }
    
    function displayPalette(palette) {
        extractedPalette.innerHTML = '';
        
        palette.forEach(color => {
            const [r, g, b] = color;
            const hexColor = rgbToHex(r, g, b);
            
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = hexColor;
            
            const hexValue = document.createElement('span');
            hexValue.className = 'hex-value';
            hexValue.textContent = hexColor.toUpperCase();
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = 'Copy to clipboard';
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(hexColor).then(() => {
                    // Show copied notification
                    const notification = document.createElement('div');
                    notification.className = 'copy-notification';
                    notification.textContent = 'Copied!';
                    swatch.appendChild(notification);
                    setTimeout(() => notification.remove(), 1000);
                });
            });
            
            swatch.appendChild(hexValue);
            swatch.appendChild(copyBtn);
            extractedPalette.appendChild(swatch);
        });
    }
    
    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function resetUI() {
        uploadContainer.style.display = 'flex';
        imagePreviewContainer.style.display = 'none';
        extractedPaletteContainer.style.display = 'none';
        imageUpload.value = '';
    }
    
    function savePalette() {
        const hexValues = Array.from(document.querySelectorAll('#extracted-palette .hex-value'))
            .map(span => span.textContent);
        
        // Save to localStorage
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
        savedPalettes.push({
            id: Date.now(),
            colors: hexValues,
            source: 'image',
            date: new Date().toISOString()
        });
        
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
        
        // Show confirmation
        alert('Palette saved successfully!');
    }
    
    function copyColors() {
        const hexValues = Array.from(document.querySelectorAll('#extracted-palette .hex-value'))
            .map(span => span.textContent)
            .join(', ');
        
        navigator.clipboard.writeText(hexValues).then(() => {
            alert('Colors copied to clipboard!');
        });
    }
});