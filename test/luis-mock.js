var nock = require('nock');
var config;
var model;
var key;

if(!process.env.FacebookClientID) {
    config = require('../config/auth');
    model = config.bot.luisModel;
    key = config.bot.cognitiveServiceKey;
} else {
    model = process.env.BotLuisModel;
    key = process.env.BotCognitiveServiceKey;
}

function setup() {
    // luis.ai mocks
    console.log("Mocking ok");
    
    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Hello'))
    .reply(200, {
        'query': 'Hello',
        'intents': [
            {
                'intent': 'Hello'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Age'))
    .reply(200, {
        'query': 'Age',
        'intents': [
            {
                'intent': 'Age'
            }
        ],
        'entities': [
            {}
        ]
    });

    // nock('https://westus.api.cognitive.microsoft.com')
    // .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Appearance'))
    // .reply(200, {
    //     'query': 'Appearance',
    //     'intents': [
    //         {
    //             'intent': 'Appearance'
    //         }
    //     ],
    //     'entities': [
    //         {}
    //     ]
    // });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Create'))
    .reply(200, {
        'query': 'Create',
        'intents': [
            {
                'intent': 'Create'
            }
        ],
        'entities': [
            {}
        ]
    });

    // nock('https://westus.api.cognitive.microsoft.com')
    // .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Feedback Donald'))
    // .reply(200, {
    //     'query': 'Feedback Donald',
    //     'intents': [
    //         {
    //             'intent': 'FeedbackDonaldIntent'
    //         }
    //     ],
    //     'entities': [
    //         {}
    //     ]
    // });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Find'))
    .reply(200, {
        'query': 'Find',
        'intents': [
            {
                'intent': 'Find'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Help'))
    .reply(200, {
        'query': 'Help',
        'intents': [
            {
                'intent': 'Help'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Hobbies'))
    .reply(200, {
        'query': 'Hobbies',
        'intents': [
            {
                'intent': 'Hobbies'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Language'))
    .reply(200, {
        'query': 'Language',
        'intents': [
            {
                'intent': 'Language'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Location'))
    .reply(200, {
        'query': 'Location',
        'intents': [
            {
                'intent': 'Location'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Modify'))
    .reply(200, {
        'query': 'Modify',
        'intents': [
            {
                'intent': 'Modify'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('None'))
    .reply(200, {
        'query': 'None',
        'intents': [
            {
                'intent': 'None'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Reality'))
    .reply(200, {
        'query': 'Reality',
        'intents': [
            {
                'intent': 'Reality'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('State'))
    .reply(200, {
        'query': 'State',
        'intents': [
            {
                'intent': 'State'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Time'))
    .reply(200, {
        'query': 'Time',
        'intents': [
            {
                'intent': 'Time'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('What'))
    .reply(200, {
        'query': 'What',
        'intents': [
            {
                'intent': 'What'
            }
        ],
        'entities': [
            {}
        ]
    });

    nock('https://westus.api.cognitive.microsoft.com')
    .get('/luis/v2.0/apps/07ed3d92-346c-466c-8c97-e91b95ccf3a3?subscription-key=85ef85d19b8940afb875a484617b3112&verbose=true&timezoneOffset=0&q=' + encodeURIComponent('Who'))
    .reply(200, {
        'query': 'Who',
        'intents': [
            {
                'intent': 'Who'
            }
        ],
        'entities': [
            {}
        ]
    });


    // sentiment analysis mock
    nock('https://westus.api.cognitive.microsoft.com', {
        reqheaders: {
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .post('/text/analytics/v2.0/sentiment')
    .reply(200, {
        'documents': [
            { 'score': 0.7 }
        ],
        'errors': []
    });

    // sentiment analysis error mock
    nock('https://westus.api.cognitive.microsoft.com', {
        reqheaders: {
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .post('/text/analytics/v2.0/sentiment')
    .replyWithError('something broke');
}

module.exports = {
    setup: setup
};