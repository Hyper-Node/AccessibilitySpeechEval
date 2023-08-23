const fs = require('fs');


// in Brill_POS_TAGGER.js replace logger.setLevel with logger.level = 'DEBUG';
try {
    const data = fs.readFileSync('./speechComparison.json', 'utf8');
    console.log(data);
} catch (err) {
    console.error(err);
}

const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stringSimilarity = require('string-similarity');

// Example math formulas
const formula1 = "P(n, k) = n! / (n - k)!";
const formula2 = "C(n, k) = n! / (k! * (n - k)!)";

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

const jaccardSimilarity2 = intersection.size / union.size;
console.log(`Jaccard Similarity1: ${jaccardSimilarity2}`);




// Jaccard similarity
//const jaccardSimilarity = stringSimilarity.jaccardIndex(formula1Tokens, formula2Tokens);
//console.log(`Jaccard Similarity: ${jaccardSimilarity}`);

var jaccard = require ('jaccard-similarity-sentences');

var measure = jaccard.jaccardSimilarity(formula1, formula2);

console.log(`Jaccard Similarity2: ${measure}`);