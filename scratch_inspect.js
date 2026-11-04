const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('E:/Textbook 1.pdf');

pdf(dataBuffer, { max: 15 }).then(function(data) {
    console.log("Number of pages:", data.numpages);
    console.log("Info:", data.info);
    console.log("Text sample (first 2000 chars):");
    console.log(data.text.substring(0, 2000));
}).catch(err => {
    console.error("Error reading PDF:", err);
});
