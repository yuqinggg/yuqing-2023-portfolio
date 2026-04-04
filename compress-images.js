require("dotenv").config();
const tinify = require("tinify");
tinify.key = process.env.TINYPNG_API_KEY;

const fs = require("fs");
const path = require("path");

const imgDir = path.join(__dirname, "img");

function compressImages(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      compressImages(fullPath);
    } else if (/\.(png|jpg|jpeg)$/i.test(file.name)) {
      const source = tinify.fromFile(fullPath);
      source.toFile(fullPath);
      console.log(`✓ Compressed: ${file.name}`);
    }
  });
}

compressImages(imgDir);
console.log("✓ All images compressed successfully!");
