const { TesseractWorker } = require("tesseract.js");


const identifyDigits = async images => {
  const worker = new TesseractWorker();

  const results = await Promise.all(
    images.map(image =>
      worker.recognize(image, "eng", { tessedit_char_whitelist: "0123456789" })
    )
  );
  return results.map(r => r.text.replace("\n", ""));
};

module.exports = {
  identifyDigits
};
