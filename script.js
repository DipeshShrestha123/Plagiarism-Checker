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
          console.log("its docx file");
      // use Mammoth to convert the DOCX file to HTML
      mammoth.convertToHtml({arrayBuffer: file}).then((result) => {
        // get the HTML content from the result
        let htmlContent = result.value;
  
        // display the HTML content in the textarea
        let textarea = document.getElementById('textArea');
        textarea.value = htmlContent;
      });
    }
    else {
      alert("Please upload a text, PDF or Word (.docx) file.");
    }
  };

  if (file) {
    reader.readAsArrayBuffer(file);
  }
});
