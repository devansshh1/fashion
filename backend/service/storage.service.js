const ImageKit = require("imagekit");
const sharp = require("sharp");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

exports.uploadImage = async (buffer, originalName) => {
  const extension = originalName.split(".").pop();

  // 📏 Get original dimensions
  const metadata = await sharp(buffer).metadata();

  const width = metadata.width;
  const height = metadata.height;

  console.log("ORIGINAL SIZE:", width, "x", height);

  const MAX_PIXELS = 24_000_000; // slightly below 25MP
  const currentPixels = width * height;

  let finalBuffer;

  if (currentPixels > MAX_PIXELS) {
    const scaleFactor = Math.sqrt(MAX_PIXELS / currentPixels);

    const newWidth = Math.floor(width * scaleFactor);
    const newHeight = Math.floor(height * scaleFactor);

    console.log("RESIZING TO:", newWidth, "x", newHeight);

    finalBuffer = await sharp(buffer)
      .resize(newWidth, newHeight)
      .jpeg({ quality: 85 })
      .toBuffer();
  } else {
    finalBuffer = await sharp(buffer)
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  return await imagekit.upload({
    file: finalBuffer,
    fileName: `${Date.now()}.${extension}`
  });
};