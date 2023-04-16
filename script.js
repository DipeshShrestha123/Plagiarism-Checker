let button = document.querySelector('.btn');
let input = document.querySelector('.hid');
button.onclick = ()=>{
    input.click();
}


function checkPlagiarism() {
    // get the contents of the textarea and check for plagiarism
  }


  
  document.getElementById('fileInput').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      document.getElementById('textArea').value = contents;
    };
    reader.readAsText(file);
  });




  const pdfFileInput = document.getElementById('pdf-file-input');
  const pdfTextarea = document.getElementById('pdf-textarea');

  pdfFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const pdfData = new Uint8Array(event.target.result);
      pdfjsLib.getDocument({ data: pdfData }).promise.then((pdf) => {
        const numPages = pdf.numPages;
        let pdfText = '';

        for (let i = 1; i <= numPages; i++) {
          pdf.getPage(i).then((page) => {
            return page.getTextContent();
          }).then((textContent) => {
            textContent.items.forEach((item) => {
              pdfText += item.str + ' ';
            });

            if (i === numPages) {
              pdfTextarea.value = pdfText;
            }
          });
        }
      });
    };

    reader.readAsArrayBuffer(file);
  });