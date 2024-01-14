import requests

# Sample survey responses
survey_responses = [
    'The product is great!',
    'Customer service needs improvement.',
    'I love the new feature.',
    'The app is not user-friendly.',
]

# API endpoint for sentiment analysis
api_endpoint = 'http://localhost:3000/sentimentAnalysis'

# Send a POST request to the Express app
response = requests.post(api_endpoint, json={'responses': survey_responses})

# Print the results
print(response.json())
