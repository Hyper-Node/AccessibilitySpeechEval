const htmlp = require( 'node-html-parser' );
const he = require('he'); // Import the 'he' library
const fs = require('fs');
const entities  = require('html-entities');
const crypto = require('crypto');


var fileContent;

const INPUT_FILE = './eval_data/w3c_intent_example_index.html';
const OUTPUT_FILE = './eval_data/intent_mathml_testing_extracted.json';
try {
    fileContent = fs.readFileSync(INPUT_FILE, 'utf8');
} catch (err) {
    console.error(err);
    process.exit(1);
}
var finalJSON = [];

const root = htmlp.parse(fileContent);

// var rows = root.querySelector("body > table:nth-child(4) > tbody:nth-child(3)");


var rows = root.querySelectorAll("body > table > tr");

for(var i=1;i<rows.length;i++){
    var row = rows[i];
    // var el0 = row.querySelectorAll("td:nth-child(0)");
    var mathML = row.querySelectorAll("td:nth-child(1) > math  ").toString();
    var mathMLDefault = row.querySelectorAll("td:nth-child(2)  > pre ");
    var mathMLDefaultZero = removeBold(decodePreString(mathMLDefault, 0));
    var mathMLExplicit = row.querySelectorAll("td:nth-child(3)  > pre ");
    var mathMLExplicitZero = removeBold(decodePreString(mathMLExplicit, 0));
    var latex =decodeLaTeXColumn( row.querySelectorAll("td:nth-child(4) "));
    var comment = decodeCommentColumn(row.querySelectorAll("td:nth-child(5)  > a  "));
    var hashData = comment + latex;
    var hash = crypto.createHash('md5').update(hashData).digest('hex');

    if(!mathML){
        continue;
    }
    console.log("MathML: \t" + mathML);
    console.log("MathMLDefault(0): \t" + mathMLDefaultZero);
    console.log("MathMLExplicit(0): \t" + mathMLExplicitZero);
    console.log("LaTeX(0): \t" + latex);
    console.log("Name: \t" + comment);
    console.log("UniqueID(md5): \t" + hash);

    var currentEntry = {
        "name": comment,
        "mathML": mathML,
        "mathML_default": mathMLDefaultZero,
        "mathML_explicit": mathMLExplicitZero,
        "latex":latex,
        "id":hash
    }
    finalJSON.push(currentEntry);
}

function cleanString(inputString){
    if(inputString){
        return inputString.replace('\\r', '');
    }
    return inputString;
}


function saveToFile(jsonArray){
    // The `null, 2` arguments are for formatting (optional).
    const jsonString = JSON.stringify(jsonArray, null, 2);
    const jsonStringCleaned = cleanString(jsonString);
    // Define the file path where you want to save the JSON data
    const filePath = OUTPUT_FILE;

    try {
        // Write the JSON string to the file synchronously
        fs.writeFileSync(filePath, jsonStringCleaned);

        console.log('JSON data has been saved to', filePath);
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}



function removeBold(contentWithBold){
    if(contentWithBold){
        if(contentWithBold.indexOf("<b>bold</b>")!==-1){
            // Skip bold replacement for the bold example where b tags are part of the formula
            return contentWithBold;
        }
        return contentWithBold.replace(/<\/?b>/g, '');
    }
    return contentWithBold;
}

function decodeCommentColumn(comment){
  if(comment[0] && comment[0].childNodes) {
      return comment[0].childNodes[0].toString();
  }else {
      return comment.toString();
  }
}
function decodeLaTeXColumn(laTeX) {
    if (laTeX[0] && laTeX[0].childNodes) {
        var latexString = laTeX[0].childNodes[0].toString();
    } else {
        var latexString = laTeX.toString();
    }
    return latexString;
}
function decodePreString(contOuter,index){
    if(!contOuter || !contOuter.length >=1){
        return "null";
    }

    var cont = contOuter[index].toString();

    //TBD: do this without regex, seems cpu-time consuing
    const regex = /<math([\s\S]*?)<\/math>/g;
    const decodedHtml = he.decode(cont);
    const decodedHtml2 = entities.decode(decodedHtml);
    const matches =  decodedHtml.match(regex);
    return matches[0];
}

saveToFile(finalJSON);