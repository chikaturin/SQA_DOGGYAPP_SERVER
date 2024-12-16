const express = require("express");
const app = express();
const Tesseract = require("tesseract.js");
const cloudinary = require("cloudinary").v2;

const uploadCloud = require("./cloudinary.config");

app.use(express.json());
const PORT = 3000;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.post("/upload", uploadCloud.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  return res.status(200).json({
    message: "File uploaded successfully",
    url: req.file.path,
  });
});

app.post("/Image_To_Text", (req, res) => {
  const { image } = req.body;
  console.log(image);
  const imageUrl = String(`${image}`);

  Tesseract.recognize(imageUrl, "eng", { logger: (m) => console.log(m) }).then(
    ({ data: { text } }) => {
      res.status(200).json({ text });
      console.log("end");
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
