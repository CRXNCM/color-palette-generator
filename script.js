class ColorPalette {
    constructor() {
        this.colors = [];
        this.lockedColors = new Set();
        this.setup();
    }

    setup() {
        this.palette = document.getElementById('colorPalette');
        this.colorCount = document.getElementById('colorCount');
        this.customHex = document.getElementById('customHex');
        this.addColorBtn = document.getElementById('addColor');
        this.generateBtn = document.getElementById('generate-btn');

        // Initialize Sortable
        Sortable.create(this.palette, {
            animation: 150,
            onEnd: () => this.updateColorsArray()
        });

        // Event Listeners
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        this.colorCount.addEventListener('change', () => this.updateColorCount());
        this.addColorBtn.addEventListener('click', () => this.addCustomColor());

        this.generateInitialPalette();
    }

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    createColorBox(color) {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.innerHTML = `
            <div class="color" style="background-color: ${color}"></div>
            <button class="lock-btn"><i class="fas fa-unlock"></i></button>
            <span class="hex-code">${color}</span>
        `;

        const lockBtn = box.querySelector('.lock-btn');
        lockBtn.addEventListener('click', () => this.toggleLock(color, lockBtn));

        box.querySelector('.color').onclick = () => this.copyToClipboard(color);
        box.querySelector('.hex-code').onclick = () => this.copyToClipboard(color);

        return box;
    }

    toggleLock(color, btn) {
        if (this.lockedColors.has(color)) {
            this.lockedColors.delete(color);
            btn.innerHTML = '<i class="fas fa-unlock"></i>';
            btn.classList.remove('locked');
        } else {
            this.lockedColors.add(color);
            btn.innerHTML = '<i class="fas fa-lock"></i>';
            btn.classList.add('locked');
        }
    }

    generatePalette() {
        const count = parseInt(this.colorCount.value);
        this.colors = [];
        this.palette.innerHTML = '';

        // Keep locked colors
        const lockedColors = Array.from(this.lockedColors);
        lockedColors.forEach(color => {
            this.colors.push(color);
            this.palette.appendChild(this.createColorBox(color));
        });

        // Add new random colors
        while (this.colors.length < count) {
            const color = this.generateRandomColor();
            if (!this.colors.includes(color)) {
                this.colors.push(color);
                this.palette.appendChild(this.createColorBox(color));
            }
        }

        this.updateBackground();
    }

    updateColorCount() {
        this.generatePalette();
    }

    addCustomColor() {
        let color = this.customHex.value;
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            color = '#' + color.replace(/[^0-9A-F]/gi, '');
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                alert('Please enter a valid hex color code');
                return;
            }
        }

        if (this.colors.length < 8) {
            this.colors.push(color);
            this.palette.appendChild(this.createColorBox(color));
            this.updateBackground();
            this.customHex.value = '';
        }
    }

    updateColorsArray() {
        const newColors = [];
        this.palette.querySelectorAll('.hex-code').forEach(span => {
            newColors.push(span.textContent);
        });
        this.colors = newColors;
        this.updateBackground();
    }

    updateBackground() {
        document.body.style.background = `linear-gradient(45deg, ${this.colors.join(', ')})`;
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradientAnimation 15s ease infinite';
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert(`Copied ${text} to clipboard!`);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    generateInitialPalette() {
        this.generatePalette();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorPalette();
});
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
document.addEventListener('DOMContentLoaded', () => {
    const colorPalette = new ColorPalette();
    const layoutManager = new LayoutManager(colorPalette);
});
