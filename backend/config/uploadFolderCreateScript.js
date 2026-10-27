const fs = require("fs");
const path = require("path");

const CreateAllFolder = () => {
  const folders = [
    path.join(__dirname, "../public/uploads/categories"),
    path.join(__dirname, "../public/uploads/customize"),
    path.join(__dirname, "../public/uploads/products"),
  ];

  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder, { recursive: true });
      } catch (err) {
        console.error("Error creating folder:", folder, err);
      }
    }
  });
};

module.exports = CreateAllFolder;
