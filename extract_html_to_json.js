const htmlp = require( 'node-html-parser' );
const he = require('he'); // Import the 'he' library
const fs = require('fs');
const entities  = require('html-entities');
const crypto = require('crypto');


var fileContent;
try {
    fileContent = fs.readFileSync('./eval_data/w3c_intent_example_index.html', 'utf8');
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
    var mathML = row.querySelectorAll("td:nth-child(1) > math  ");
    var mathMLDefault = row.querySelectorAll("td:nth-child(2)  > pre ");
    var mathMLExplicit = row.querySelectorAll("td:nth-child(3)  > pre ");
    var laTeX =decodeLaTeXColumn( row.querySelectorAll("td:nth-child(4) "));
    var comment = decodeCommentColumn(row.querySelectorAll("td:nth-child(5)  > a  "));
    var hashData = comment + laTeX;
    var hash = crypto.createHash('md5').update(hashData).digest('hex');

    if(!mathML){
        continue;
    }
    console.log("MathML: \t" + mathML.toString());
    console.log("MathMLDefault(0): \t" + removeBold(decodePreString(mathMLDefault, 0)));
    console.log("MathMLExplicit(0): \t" + removeBold(decodePreString(mathMLExplicit, 0)));
    console.log("LaTeX(0): \t" + laTeX);
    console.log("Name: \t" + comment);
    console.log("UniqueID(md5): \t" + hash);
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

