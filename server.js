const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require('path');
const sql = require('mssql');
const analyticsRouter = require('./analytics');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/analytics', analyticsRouter);
app.use(express.static(path.join(__dirname)));

let scheduledSurveys = [];
const config = {
    user: 'Ayush',
    password: 'Lucky200verma',
    server: 'VICTUS\\SQLEXPRESS',
    database: 'surveyDB',
    options: {
        encrypt: true, 
    },
};

sql.connect(config)
    .then(() => console.log('Connected to MS SQL Server'))
    .catch(err => console.error('Error connecting to MS SQL Server:', err));

const surveyResponseTable = new sql.Table('SurveyResponses');
surveyResponseTable.columns.add('Channel', sql.NVarChar(255));
surveyResponseTable.columns.add('Response', sql.NVarChar(255));
app.post('/scheduleSurvey', (req, res) => {
    const surveyData = req.body;

    sendSurvey(surveyData);

    const task = cron.schedule(`0 0 */${surveyData.interval} * *`, () => {
        sendSurvey(surveyData);
    });

    scheduledSurveys.push({ data: surveyData, task });

    res.json({ message: 'Survey scheduled successfully' });
});
app.post('/sentimentAnalysis', (req, res) => {
    const surveyResponses = req.body.responses;
    const sentimentResults = performSentimentAnalysis(surveyResponses);

    res.json(sentimentResults);
});

app.post('/collectSurveyResponseEmail', async (req, res) => {
    const { response } = req.body;
    try {
        await saveSurveyResponse('Email', response);
        res.json({ success: true, message: 'Survey response collected successfully via email' });
    } catch (error) {
        console.error('Error collecting survey response via email:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

async function saveSurveyResponse(channel, response) {
    const request = new sql.Request();
    surveyResponseTable.rows.add(channel, response);
    await request.bulk(surveyResponseTable);
}
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
