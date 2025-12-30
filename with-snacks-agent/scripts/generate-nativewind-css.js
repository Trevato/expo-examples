const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== NativeWind CSS Generation Script ===");
console.log("Working directory:", process.cwd());
console.log("Script directory:", __dirname);

const cacheDir = path.join(__dirname, "..", "node_modules", ".cache", "nativewind");
const globalCss = path.join(__dirname, "..", "global.css");

console.log("Cache directory:", cacheDir);
console.log("Input CSS:", globalCss);

// Check if input exists
if (!fs.existsSync(globalCss)) {
  console.error("ERROR: global.css not found at", globalCss);
  process.exit(1);
}

// Create cache directory
fs.mkdirSync(cacheDir, { recursive: true });
console.log("Created cache directory");

// Generate CSS files
const outputs = [
  "global.css",
  "global.css.ios.css",
  "global.css.web.css",
];

for (const output of outputs) {
  const outputPath = path.join(cacheDir, output);
  console.log(`\nGenerating: ${outputPath}`);
  try {
    execSync(`npx tailwindcss -i "${globalCss}" -o "${outputPath}" --minify`, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });

    // Verify file was created
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log(`SUCCESS: ${output} (${stats.size} bytes)`);
    } else {
      console.error(`ERROR: ${output} was not created`);
    }
  } catch (error) {
    console.error(`FAILED: ${output}`, error.message);
  }
}

// List all files in cache dir
console.log("\n=== Cache directory contents ===");
try {
  const files = fs.readdirSync(cacheDir);
  files.forEach(f => {
    const stats = fs.statSync(path.join(cacheDir, f));
    console.log(`  ${f}: ${stats.size} bytes`);
  });
} catch (e) {
  console.error("Could not list cache directory:", e.message);
}

console.log("\n=== NativeWind CSS Generation Complete ===");
