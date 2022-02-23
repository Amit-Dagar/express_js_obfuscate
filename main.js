const path = require("path");
const fs = require("fs");
var JavaScriptObfuscator = require("javascript-obfuscator");

const dir = "../backend";
const dist = "../dist";

const backendPath = path.join(__dirname, dir);
const distPath = path.join(__dirname, dist);

// create folder dist if not exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

function obfucate(backendPath, distPath) {
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  const files = fs.readdirSync(backendPath);
  console.log(files);

  files.forEach((file) => {
    // check if file extention is js
    if (path.extname(file) === ".js") {
      const filePath = path.join(backendPath, file);
      const distFilePath = path.join(distPath, file);
      const obfuscated = JavaScriptObfuscator.obfuscate(
        fs.readFileSync(filePath, "utf8"),
        {
          compact: true,
          controlFlowFlattening: true,
        }
      );
      fs.writeFileSync(distFilePath, obfuscated.getObfuscatedCode(), "utf8");
    }
    // if file is a directory, call obfucate function again
    else if (fs.lstatSync(path.join(backendPath, file)).isDirectory()) {
      obfucate(path.join(backendPath, file), path.join(distPath, file));
    } else {
      fs.copyFileSync(path.join(backendPath, file), path.join(distPath, file));
    }
  });
  return;
}

obfucate(backendPath, distPath);
