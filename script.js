const loading = document.getElementById("loading");
const result = document.getElementById("result");

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  processImage(file);
});

document.addEventListener("paste", function (e) {
  const items = (e.clipboardData || window.clipboardData).items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const blob = items[i].getAsFile();
      processImage(blob);
      break;
    }
  }
});

function processImage(file) {
  loading.style.display = "block";
  result.innerText = "";

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      Tesseract.recognize(img, "eng", { logger: (m) => console.log(m) })
        .then(({ data: { text } }) => {
          loading.style.display = "none";
          result.innerText = text;
        })
        .catch((err) => {
          loading.style.display = "none";
          result.innerText = "Error: " + err.message;
        });
    };
  };
  reader.readAsDataURL(file);
}

