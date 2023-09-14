const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stringSimilarity = require('string-similarity');
var jaccard = require ('jaccard-similarity-sentences');
const fs = require('fs');
var evalSet = null;

const INPUT_FILE = "./eval_data/IntentParserTestLocal-Speech.json";
const OUTPUT_FILE= "./eval_data/IntentParserTestLocal-Similarity.json";

// in Brill_POS_TAGGER.js replace logger.setLevel with logger.level = 'DEBUG';
try {
    const jsonString = fs.readFileSync(INPUT_FILE, 'utf8');
    evalSet = JSON.parse(jsonString);
    console.log(evalSet);
} catch (err) {
    console.error(err);
    process.exit(1);
}

function generateNgrams(input, n) {
    const ngrams = [];
    for (let i = 0; i <= input.length - n; i++) {
        ngrams.push(input.substring(i, i + n));
    }
    return ngrams;
}

function calculateMeasures(formula1, formula2) {
    console.log("Comparing: \"" + formula1 +"\" to: \"" + formula2 +"\"");
    // Levenshtein distance
    const levenshteinDistance = natural.LevenshteinDistance(formula1, formula2);
    console.log(`Levenshtein Distance: ${levenshteinDistance}`);

    // Cosine similarity
    const formula1Tokens = tokenizer.tokenize(formula1);
    const formula2Tokens = tokenizer.tokenize(formula2);
    const cosineSimilarity = stringSimilarity.compareTwoStrings(formula1Tokens.join(' '), formula2Tokens.join(' '));
    console.log(`Cosine Similarity: ${cosineSimilarity}`);

    // Tokenize the formulas
    const formula1TokensS = new Set(formula1.split(' '));
    const formula2TokensS = new Set(formula2.split(' '));

    // Calculate Jaccard similarity
    const intersection = new Set([...formula1TokensS].filter(token => formula2TokensS.has(token)));
    const union = new Set([...formula1TokensS, ...formula2TokensS]);

    const jaccardSimilarity1 = intersection.size / union.size;
    console.log(`Jaccard Similarity1: ${jaccardSimilarity1}`);

    var jaccardSimilarity2 = jaccard.jaccardSimilarity(formula1, formula2);
    console.log(`Jaccard Similarity2: ${jaccardSimilarity2}`);
    
    // Define the n-gram length
    const n = 3; // Change this to the desired n-gram length

    // Generate n-grams for both formulas
    const formula1Ngrams = new Set(generateNgrams(formula1, n));
    const formula2Ngrams = new Set(generateNgrams(formula2, n));

    const lengthNGramsMax = Math.max(formula1Ngrams.size,formula2Ngrams.size);
    // Calculate the number of common n-grams
    const commonNgrams = [...formula1Ngrams].filter(ngram => formula2Ngrams.has(ngram));
    const commonNgramCount = commonNgrams.length;
    const commonNGramRate =commonNgrams.length / formula1Ngrams.size ;

    console.log(`Number of common ${n}-grams: ${commonNgramCount}`);

    var ret = {
        "cosine-sim": cosineSimilarity,
        "levenshtein": levenshteinDistance,
        "jaccard": jaccardSimilarity1,
        "n-gram": commonNGramRate
    };
    return ret;
}

var finalEntries = [];
evalSet.forEach((entry) =>{
    console.log("formula-tex: " + entry['latex'] );
    var ret1 = calculateMeasures(entry["Speech_MathML_texvc"], entry["Speech_MathML_default"]);
    var ret2 = calculateMeasures(entry["Speech_MathML_explicit"], entry["Speech_MathML_default"]);

    entry["similarity-texvc-default"] = ret1;
    entry["similarity-explicit-default"] = ret2;

    finalEntries.push(entry);
    console.log("------");
});


var jsonContent = JSON.stringify(finalEntries,null,"\t");
console.log(jsonContent);

fs.writeFileSync(OUTPUT_FILE, jsonContent);