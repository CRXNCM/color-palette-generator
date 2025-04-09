class GradientGenerator {
    constructor() {
        this.colors = [];
        this.setup();
    }

    setup() {
        this.gradientDisplay = document.getElementById('gradientDisplay');
        this.colorCount = document.getElementById('colorCount');
        this.customHex = document.getElementById('customHex');
        this.addColorBtn = document.getElementById('addColor');
        this.generateBtn = document.getElementById('generate-btn');

        this.addColorBtn.addEventListener('click', () => this.addCustomColor());
        this.generateBtn.addEventListener('click', () => this.generateGradient());
        
        // Initialize with default colors
        this.colors = ['#FF5733', '#33FF57'];
        this.updateGradient();
    }

    addCustomColor() {
        const color = this.customHex.value;
        if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
            this.colors.push(color);
            this.updateGradient();
            this.customHex.value = '';
        }
    }

    generateGradient() {
        this.colors = Array.from({length: parseInt(this.colorCount.value)}, 
            () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
        this.updateGradient();
    }

    updateGradient() {
        const gradient = `linear-gradient(45deg, ${this.colors.join(', ')})`;
        this.gradientDisplay.style.background = gradient;
    }
}

// Initialize the gradient generator when on the create-gradient page
if (document.getElementById('gradientDisplay')) {
    new GradientGenerator();
}
// Add this to your existing JavaScript
class LayoutManager {
    constructor(palette) {
        this.palette = palette;
        this.layoutButtons = document.querySelectorAll('.layout-btn');
        this.setupLayoutControls();
    }

    setupLayoutControls() {
        this.layoutButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeLayout(btn.dataset.layout);
                this.updateActiveButton(btn);
            });
        });
    }

    changeLayout(layout) {
        const paletteElement = document.getElementById('colorPalette');
        paletteElement.className = `color-palette ${layout}`;
        
        if (layout === 'circular') {
            this.applyCircularLayout();
        }
    }

    applyCircularLayout() {
        const colorBoxes = document.querySelectorAll('.color-box');
        const totalColors = colorBoxes.length;
        const radius = 150; // Adjust radius as needed

        colorBoxes.forEach((box, index) => {
            const angle = (index / totalColors) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            box.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    updateActiveButton(activeBtn) {
        this.layoutButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Initialize LayoutManager in your existing code
document.addEventListener('DOMContentLoaded', function() {
    const colorPalette = document.getElementById('colorPalette');
    const generateBtn = document.getElementById('generate-btn');
    const colorCount = document.getElementById('colorCount');
    const customHex = document.getElementById('customHex');
    const addColorBtn = document.getElementById('addColor');
    const paletteActions = document.getElementById('palette-actions');
    const savePaletteBtn = document.getElementById('save-palette');
    const copyPaletteBtn = document.getElementById('copy-palette');
    
    // Generate random color in hex format
    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // Create a color swatch element
    function createColorSwatch(color) {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        
        const hexValue = document.createElement('span');
        hexValue.className = 'hex-value';
        hexValue.textContent = color.toUpperCase();
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = 'Copy to clipboard';
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(color).then(() => {
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
        return swatch;
    }
    
    // Generate a new palette
    function generatePalette() {
        colorPalette.innerHTML = '';
        const count = parseInt(colorCount.value);
        
        for (let i = 0; i < count; i++) {
            const color = generateRandomColor();
            const swatch = createColorSwatch(color);
            colorPalette.appendChild(swatch);
        }
        
        // Show palette actions
        paletteActions.style.display = 'flex';
        
        // Make palette sortable
        new Sortable(colorPalette, {
            animation: 150,
            ghostClass: 'sortable-ghost'
        });
    }
    
    // Add custom color
    function addCustomColor() {
        const hexCode = customHex.value.trim();
        // Basic validation for hex code
        if (/^#?[0-9A-Fa-f]{6}$/.test(hexCode)) {
            const color = hexCode.startsWith('#') ? hexCode : '#' + hexCode;
            const swatch = createColorSwatch(color);
            colorPalette.appendChild(swatch);
            customHex.value = '';
            
            // Show palette actions
            paletteActions.style.display = 'flex';
        } else {
            alert('Please enter a valid hex color code (e.g. #4f46e5 or 4f46e5)');
        }
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generatePalette);
    addColorBtn.addEventListener('click', addCustomColor);
    
    // Copy all colors
    copyPaletteBtn.addEventListener('click', function() {
        const hexValues = Array.from(document.querySelectorAll('.hex-value'))
            .map(span => span.textContent)
            .join(', ');
        
        navigator.clipboard.writeText(hexValues).then(() => {
            alert('All colors copied to clipboard!');
        });
    });
    
    // Save palette (basic implementation)
    savePaletteBtn.addEventListener('click', function() {
        const hexValues = Array.from(document.querySelectorAll('.hex-value'))
            .map(span => span.textContent);
        
        // In a real app, you would save this to localStorage or a database
        localStorage.setItem('savedPalette', JSON.stringify(hexValues));
        alert('Palette saved!');
    });
    
    // Generate initial palette
    generatePalette();
});