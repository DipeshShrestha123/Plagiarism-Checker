let button = document.querySelector('.btn');
let input = document.querySelector('.hid');
let textArea = document.getElementById("textArea");

button.onclick = ()=>{
  input.click();
}

input.addEventListener('change', function() {
  let file = input.files[0];
  let fileName = file.name;
  // console.log(fleName);
  let reader = new FileReader();

  reader.onload = function() {
    let text = "";
    if (fileName.endsWith(".txt")) {
      // use a FileReader to read the contents of the file
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        // get the contents of the file
        let fileContent = reader.result;
  
        // display the file contents in the textarea
        let textarea = document.getElementById('textArea');
        textarea.value = fileContent;
      };
    }  else if (fileName.endsWith(".pdf")) {
      // If the file is a PDF, convert it to text using pdf.js
      let loadingTask = pdfjsLib.getDocument(reader.result);
      loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
          page.getTextContent().then(function(textContent) {
            for (let i = 0; i < textContent.items.length; i++) {
              text += textContent.items[i].str + " ";
            }
            textArea.value = text;
          });
        });
      });
    } // check if the file is a DOCX file
    else if (fileName.endsWith('.docx')) {
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
      mammoth.convertToHtml({arrayBuffer: arrayBuffer})
          .then(displayResult, function(error) {
              console.error(error);
          });
  });
}

function displayResult(result) {
  // filter out any images in the HTML result
  var htmlContent = result.value.replace(/<img[^>]*>/g, "");

  // remove all html tags from the filtered HTML content
  var div = document.createElement("div");
  div.innerHTML = htmlContent;
  var textContent = div.textContent || div.innerText || "";
  var plainText = textContent.trim();

  // format the output text
  var formattedText = plainText.replace(/\n/g, "\n\n").replace(/\s\s+/g, " ");

  // write the formatted text to the textarea
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
