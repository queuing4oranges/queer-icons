const fs = require('fs');
const path = require('path');

// Define the paths to the 'icons' folder and the 'dist' folder
const iconsDir = path.join(__dirname, '..', 'icons'); // Path to the 'icons' folder, going up one level
const outputDir = path.join(__dirname, '..', 'dist'); // Path to output the generated CSS

// Get all SVG files from the 'icons' directory
const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));

// Initialize an empty string to hold the CSS content
let cssContent = '';

// Function to process the SVG files asynchronously
async function generateCSS() {
	for (const file of svgFiles) {
		const iconName = path.basename(file, '.svg'); // Get the name of the icon (without the '.svg' extension)
		const svgPath = path.join(iconsDir, file); // Get the full path to the SVG file

		try {
			// Read the SVG file as a Buffer
			const svgBuffer = await fs.promises.readFile(svgPath);
			const base64Data = svgBuffer.toString('base64'); // Convert the buffer to Base64

			// Create the CSS rule for this icon
			cssContent += `.qi-${iconName} {
	background-image: url('data:image/svg+xml;base64,${base64Data}');
}\n\n`;

		} catch (err) {
			console.error("Error reading or converting SVG to Base64:", err);
		}
	}

	// Adding shared CSS for width, height, and other common properties
	cssContent = `.qi-icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
    background-size: contain;
    box-sizing: border-box;
}\n\n` + cssContent;

	// Ensure the dist directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// Write the CSS to a file in the dist folder after processing all SVG files
	const cssFilePath = path.join(outputDir, 'queer-icons.css');
	await fs.promises.writeFile(cssFilePath, cssContent);

	console.log('CSS file generated at: ' + cssFilePath);
}

// Call the function to generate the CSS
generateCSS();
