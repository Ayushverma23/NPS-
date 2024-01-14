const express = require('express');
const router = express.Router();
const { performSentimentAnalysis } = require('./analytics');

router.post('/sentimentAnalysis', (req, res) => {
    const surveyResponses = req.body.responses;

    // Perform sentiment analysis using your Python script
    const sentimentResults = performSentimentAnalysis(surveyResponses);

    res.json(sentimentResults);
});

module.exports = router;
