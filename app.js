const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
let scheduledSurveys = [];
const devRevApi = {
    submitSurvey: async (surveyData) => {
        console.log(`Submitting survey to DevRev: ${surveyData.question}`);
    },
    scheduleSurvey: async (surveyData, interval) => {
        console.log(`Scheduling survey with DevRev: ${surveyData.question}`);
    },
};

app.post('/submitSurvey', async (req, res) => {
    const surveyData = req.body;
    try {
        await devRevApi.submitSurvey(surveyData);
        res.json({ success: true, message: 'Survey submitted successfully' });
    } catch (error) {
        console.error('Error submitting survey:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/scheduleSurvey', async (req, res) => {
    const surveyData = req.body;
    const { interval } = surveyData;

    try {
        await devRevApi.scheduleSurvey(surveyData, interval);

        const task = cron.schedule(`0 0 */${interval} * *`, () => {
            devRevApi.submitSurvey(surveyData);
        });
        scheduledSurveys.push({ data: surveyData, task });

        res.json({ success: true, message: 'Survey scheduled successfully' });
    } catch (error) {
        console.error('Error scheduling survey:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
