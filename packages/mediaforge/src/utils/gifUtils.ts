let selectedOverlays = []; // Array to track selected overlays
let gifCanvas; // Reference to the GIF canvas
let gifContext; // Context for the canvas

// Function to initialize canvas
function initCanvas(canvasId) {
    gifCanvas = document.getElementById(canvasId);
    gifContext = gifCanvas.getContext("2d");
}

function getCurrentGIFFrame() {
    // Placeholder function to get the current GIF frame
    // In a real implementation, this would extract the current frame from the GIF
    return new Promise((resolve) => {
        const img = new Image();
        img.src = 'path/to/current/gif/frame.png';
        img.onload = () => resolve(img);
    });
}

// Function to update overlays in real-time
function toggleOverlay(overlay): Promise<any> {
    const overlayIndex = selectedOverlays.findIndex(o => o.id === overlay.id);
    if (overlayIndex > -1) {
        // Remove overlay if already selected
        selectedOverlays.splice(overlayIndex, 1);
    } else {
        // Add overlay if not selected
        selectedOverlays.push(overlay);
    }
    return renderGIFWithOverlays();
}

// Function to draw overlays onto the canvas
async function drawOverlays() {
    await Promise.all(
        selectedOverlays.map(overlay => {
            return new Promise<void>((resolve) => {
                const image = new Image();
                image.src = overlay.src;
                image.onload = () => {
                    gifContext.drawImage(image, overlay.x, overlay.y, overlay.width, overlay.height);
                    resolve();
                };
                image.onerror = () => resolve(); // Prevent hanging if image fails to load
            });
        })
    );
}

// Main function to render GIF with overlays
async function renderGIFWithOverlays() {
    // Clear the canvas
    gifContext.clearRect(0, 0, gifCanvas.width, gifCanvas.height);

    // Draw the base GIF frame
    const baseGifFrame = await getCurrentGIFFrame(); // Function to get current GIF frame
    gifContext.drawImage(baseGifFrame, 0, 0, gifCanvas.width, gifCanvas.height);

    // Draw selected overlays
    const overlays = drawOverlays();
    return overlays;
}

// Function to handle GIF updates in real-time
async function handleGIFUpdates() {
    setInterval(async () => {
        renderGIFWithOverlays();
    }, 100); // Adjust interval as needed
}

// Call this function to initialize the live rendering
function setupLiveOverlayRendering(canvasId) {
    initCanvas(canvasId);
    handleGIFUpdates();
}

// Example of adding event listeners to toggle overlays
document.querySelectorAll<HTMLInputElement>(".overlay-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;
        const overlay = {
            id: target.id,
            src: target.dataset.src,
            x: parseInt(target.dataset.x ?? "0", 10),
            y: parseInt(target.dataset.y ?? "0", 10),
            width: parseInt(target.dataset.width ?? "0", 10),
            height: parseInt(target.dataset.height ?? "0", 10)
        };
        toggleOverlay(overlay);
    });
});


export {
    toggleOverlay,
    setupLiveOverlayRendering,
    handleGIFUpdates,
    renderGIFWithOverlays,
    getCurrentGIFFrame
};
