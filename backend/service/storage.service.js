const ImageKit = require("imagekit");
const sharp = require("sharp");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

exports.uploadImage = async (buffer, originalName) => {
  const extension = (originalName.split(".").pop() || "jpg").toLowerCase();
  const safeOriginalName = originalName || `upload.${extension}`;
  const maxPixels = 24_000_000;

  try {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width;
    const height = metadata.height;
    const currentPixels =
      typeof width === "number" && typeof height === "number"
        ? width * height
        : 0;

    let finalBuffer;

    if (currentPixels > maxPixels) {
      const scaleFactor = Math.sqrt(maxPixels / currentPixels);
      const newWidth = Math.floor(width * scaleFactor);
      const newHeight = Math.floor(height * scaleFactor);

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
      fileName: `${Date.now()}.jpg`
    });
  } catch (error) {
    console.error(
      "Image processing failed, uploading original file instead:",
      error.message
    );

    return await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${safeOriginalName}`
    });
  }
};

exports.uploadVideo = async (buffer, originalName) => {
  const extension = originalName.split(".").pop();

  return await imagekit.upload({
    file: buffer,
    fileName: `${Date.now()}.${extension}`,
    folder: "/videos",
    useUniqueFileName: true,
    tags: ["model-video", "reels"],
    isPrivateFile: false,
  });
};
