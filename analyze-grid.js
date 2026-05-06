const { PNG } = require("pngjs");
const fs = require("fs");

// Check M3 (checker pattern source)
const buf = fs.readFileSync("../../isolation/scanforge/frontend/public/assets/sigi/Sigi_M3.png");
const png = PNG.sync.read(buf);
console.log("Sigi_M3.png:", png.width, "x", png.height);

// Sample corner pixels to see what checker looks like
const corners = [
  [0, 0], [10, 0], [20, 0], [30, 0],
  [0, 10], [10, 10], [20, 10], [30, 10],
];
console.log("Top-left corner pixels (R,G,B,A):");
for (const [x, y] of corners) {
  const i = (y * png.width + x) * 4;
  console.log(`  (${x},${y}): ${png.data[i]},${png.data[i+1]},${png.data[i+2]},${png.data[i+3]}`);
}

// Check if there's a _nobg variant
const nobgPath = "../../isolation/scanforge/frontend/public/assets/sigi/Sigi_M3_nobg.png";
if (fs.existsSync(nobgPath)) {
  const buf2 = fs.readFileSync(nobgPath);
  const png2 = PNG.sync.read(buf2);
  console.log("\nSigi_M3_nobg.png:", png2.width, "x", png2.height);
  console.log("Corner pixels:");
  for (const [x, y] of corners) {
    const i = (y * png2.width + x) * 4;
    console.log(`  (${x},${y}): ${png2.data[i]},${png2.data[i+1]},${png2.data[i+2]},${png2.data[i+3]}`);
  }
  // Count truly transparent pixels
  let transparent = 0;
  for (let j = 3; j < png2.data.length; j += 4) {
    if (png2.data[j] < 10) transparent++;
  }
  console.log("Truly transparent pixels in nobg:", transparent, "of", png2.width * png2.height);
}

// List all sigi files
const sigiDir = "../../isolation/scanforge/frontend/public/assets/sigi";
const files = fs.readdirSync(sigiDir).filter(f => f.endsWith('.png') && !f.startsWith('frame'));
console.log("\nSigi PNG files:", files);
