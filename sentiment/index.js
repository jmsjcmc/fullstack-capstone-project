// Task 1: Import the Natural library
const natural = require("natural");
const express = require("express");

// Task 2: Initialize the Express server
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Initialize sentiment analyzer
const analyzer = new natural.SentimentAnalyzer(
  "English",
  natural.PorterStemmer,
  "afinn"
);

// Task 3: Create POST /sentiment endpoint
app.post("/sentiment", (req, res) => {
  try {
    // Task 4: Extract sentence parameter from request query
    const { sentence } = req.query;

    if (!sentence) {
      return res.status(400).json({ error: "Sentence parameter is required" });
    }

    // Tokenize sentence
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(sentence);

    // Analyze sentiment
    const analysisResult = analyzer.getSentiment(tokens);

    // Task 5: Determine sentiment label
    let sentiment = "neutral";

    if (analysisResult < 0) {
      sentiment = "negative";
    } else if (analysisResult > 0.33) {
      sentiment = "positive";
    }

    // Task 6: Success response
    res.status(200).json({
      sentimentScore: analysisResult,
      sentiment: sentiment
    });

  } catch (error) {
    // Task 7: Error response
    res.status(500).json({ error: "Sentiment analysis failed" });
  }
});

// Start server on predefined port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sentiment server running on port ${PORT}`);
});
