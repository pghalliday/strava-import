const fetch = require('node-fetch');
const FormData = require('form-data');
const express = require('express');
const secrets = require('./secrets');
const constants = require('./constants');
const AccessToken = require('./AccessToken');

const accessToken = new AccessToken();
const app = express();

app.get('/exchange_token', (req, res) => {
    const error = req.query.error;
    if (error) {
        console.error('Error encountered authorizing application');
        console.error(error);
        res.status(400).send(error);
    } else {
        const code = req.query.code;
        const scope = req.query.scope;
        console.log(`Authorized for the following scope: ${scope}`);
        console.log(`Requesting an initial access token with code: ${code}`);
        const body = new FormData();
        body.append('client_id', secrets.CLIENT_ID);
        body.append('client_secret', secrets.CLIENT_SECRET);
        body.append('code', code);
        body.append('grant_type', 'authorization_code');
        fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            body,
        })
            .then(response => response.json())
            .then(data => accessToken.write(data))
            .then(accessToken => {
                console.log(`Access token written to disk: ${accessToken}`)
                res.status(200).send('success');
            });
    }
})

app.listen(constants.AUTHORIZATION_PORT, () => {
    console.log('Visit the following URL to authorize the script:');
    console.log(`http://www.strava.com/oauth/authorize?client_id=${secrets.CLIENT_ID}&response_type=code&redirect_uri=http://localhost:${constants.AUTHORIZATION_PORT}/exchange_token&approval_prompt=force&scope=${constants.AUTHORIZATION_SCOPE}`);
})