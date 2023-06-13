let button = document.querySelector('.btn');
let input = document.querySelector('.hid');
let textArea = document.getElementById("textArea");
let plag = document.getElementById("plagBtn");
const preloader = document.getElementById('preloader');

preloader.style.display = 'none';

button.onclick = () => {
  input.click();
}

input.addEventListener('change', function() {
  let file = input.files[0];
  let fileName = file.name;
  let reader = new FileReader();

  reader.onload = function() {
    let text = "";
    if (fileName.endsWith(".txt")) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let fileContent = reader.result;
        let textarea = document.getElementById('textArea');
        textarea.value = fileContent;
      };
    } else if (fileName.endsWith(".pdf")) {
      let loadingTask = pdfjsLib.getDocument(reader.result);
      loadingTask.promise.then(function(pdf) {
        var numPages = pdf.numPages; 
        for (let q = 1; q <= numPages; q++) {
          pdf.getPage(q).then(function(page) {
            page.getTextContent().then(function(textContent) {
              for (let i = 0; i < textContent.items.length; i++) {
                text += textContent.items[i].str + " ";
              }
              textArea.value = text;
            });
          });
        }
      });
    } else if (fileName.endsWith('.docx')) {
      handleFileSelect(reader);
    } else {
      alert("Please upload a text, PDF or Word (.docx) file.");
    }
  };

  if (file) {
    reader.readAsArrayBuffer(file);
  }
});

function handleFileSelect(reader) {
  readFileInputEventAsArrayBuffer(reader, function(arrayBuffer) {
    mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
      .then(displayResult, function(error) {
        console.error(error);
      });
  });
}

function displayResult(result) {
  var htmlContent = result.value.replace(/<img[^>]*>/g, "");
  var div = document.createElement("div");
  div.innerHTML = htmlContent;
  var textContent = div.textContent || div.innerText || "";
  var plainText = textContent.trim();
  var formattedText = plainText.replace(/\n/g, "\n\n").replace(/\s\s+/g, " ");
  document.getElementById("textArea").innerHTML = formattedText;
  var messageHtml = result.messages.map(function(message) {
    return '<li class="' + message.type + '">' + escapeHtml(message.message) + "</li>";
  }).join("");
}

function readFileInputEventAsArrayBuffer(reader, callback) {
  var arrayBuffer = reader.result;
  callback(arrayBuffer);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
plag.onclick = () => {
 alert("U have to add Plagairism algorithm in code")
};

