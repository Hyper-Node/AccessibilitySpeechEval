# Run the evaluation 

1. node extract_html_to_json.js : extract from HTML 
2. run test which adds annotations in PHP (MediaWiki Math extension), copy results to eval_data
3. python generateSpeechForMathML.py: obtain speech from MathCat 
4. node compareFormulas.js : run the speech comparison metrics 

# Accessibility Speech Evaluation

Comparison of speech output for accessibility on Wikipedia paper with text similarity algorithms. 


Measures: 

Character N-Gram: 
- Create N-Grams for formulas and calculate their overlap similarity based on sliding window
- Consideration: Does not consider bigger changes in the word order and will not capture semantic similarity in all cases

Levenshtein-Distance:
- Levenshtein distance is simple and effective for measuring the minimum edit operations (insertions, deletions, substitutions) needed to transform one formula into another.
- Consideration: It treats all words or characters equally, which might not capture the semantic or structural similarity

Jaccard Similarity: 
- Captures overlap in word sets
- Consideration: It doesn't consider word order or frequency.

Cosine Similarity:
- Cosine similarity considers the angle between formula vectors, making it useful for capturing semantic similarity and ignoring word order. 
- Consideration: It doesn't account for word repetitions or differences in formula length.


TF/IDF Similarity: 
- TF-IDF is useful for capturing word importance relative to a document or set of documents.
- Consideration: It might not handle short formula texts well, and it doesn't capture semantic or structural relationships

# MathCatForPython usage 
Parts of the code for speech generation 'generateSpeechForMathML.py' and the Rules
as well as libmathcat.pyd are used from MathCATForPython by Neil Soiffer. 

