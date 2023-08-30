const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stringSimilarity = require('string-similarity');
var jaccard = require ('jaccard-similarity-sentences');
const fs = require('fs');

var evalSet = null;

// in Brill_POS_TAGGER.js replace logger.setLevel with logger.level = 'DEBUG';
try {
    const jsonString = fs.readFileSync('./speechComparison.json', 'utf8');
    evalSet = JSON.parse(jsonString);
    console.log(evalSet);
} catch (err) {
    console.error(err);
    exit();
}

function generateNgrams(input, n) {
    const ngrams = [];
    for (let i = 0; i <= input.length - n; i++) {
        ngrams.push(input.substring(i, i + n));
    }
    return ngrams;
}

function calculateMeasures(formula1, formula2) {
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

    // Calculate the number of common n-grams
    const commonNgrams = [...formula1Ngrams].filter(ngram => formula2Ngrams.has(ngram));
    const commonNgramCount = commonNgrams.length;

    console.log(`Number of common ${n}-grams: ${commonNgramCount}`);
}

evalSet.forEach((entry) =>{
    console.log("formula-tex: " + entry['formula-tex'] );
    calculateMeasures(entry.speechManual, entry.speechAuto);
    console.log("------");
});
