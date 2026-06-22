// Convert an image to AVIF, matching the team-photo optimization preset.
// Usage: npm run img:avif -- <input> <output> [width]
//   width is optional; pass it to downscale large sources (e.g. 800).
import sharp from 'sharp';

const [input, output, width] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: npm run img:avif -- <input> <output> [width]');
  process.exit(1);
}

const pipeline = sharp(input);
if (width) pipeline.resize(Number(width));

// quality 55 / effort 6: tuned sweet spot for photos (size vs. fidelity).
const info = await pipeline.avif({ quality: 55, effort: 6 }).toFile(output);
console.log(`${output}: ${Math.round(info.size / 1024)}KB ${info.width}x${info.height}`);
