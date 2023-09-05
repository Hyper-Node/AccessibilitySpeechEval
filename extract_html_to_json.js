const htmlp = require( 'node-html-parser' );
const he = require('he'); // Import the 'he' library
const fs = require('fs');
const entities  = require('html-entities');



var fileContent;
try {
    fileContent = fs.readFileSync('./eval_data/w3c_intent_example_index.html', 'utf8');
} catch (err) {
    console.error(err);
    process.exit(1);
}


const root = htmlp.parse(fileContent);

// var rows = root.querySelector("body > table:nth-child(4) > tbody:nth-child(3)");


var rows = root.querySelectorAll("body > table > tr");

for(var i=1;i<rows.length;i++){
    var row = rows[i];
    // var el0 = row.querySelectorAll("td:nth-child(0)");
    var mathML = row.querySelectorAll("td:nth-child(1) > math  ");
    var mathMLDefault = row.querySelectorAll("td:nth-child(2)  > pre ");
    var mathMLExplicit = row.querySelectorAll("td:nth-child(3)  > pre ");
    var laTeX = row.querySelectorAll("td:nth-child(4) ");

    if(!mathML){
        continue;
    }
    console.log( "MathML: \t" + mathML.toString());
    console.log("MathMLDefault(0): \t" + decodePreString(mathMLDefault, 0));
    console.log("MathMLExplicit(0): \t" + decodePreString(mathMLExplicit, 0));
    console.log("LaTeX(0): \t" + laTeX.innerHTML.toString());

    //TBD: Remove bold annotations !!




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

console.log(root.firstChild.structure);