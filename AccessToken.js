const readFile = require('fs').promises.readFile;
const writeFile = require('fs').promises.writeFile;
const fetch = require('node-fetch');
const FormData = require('form-data');
const secrets = require('./secrets');
const constants = require('./constants');

const MILLISECONDS = 1000;

module.exports = class {
    write(data) {
        return Promise.all([
            writeFile(constants.ACCESS_TOKEN_JSON, JSON.stringify({
                accessToken: data.access_token,
                expiresAt: data.expires_at,
            })),
            writeFile(constants.REFRESH_TOKEN_JSON, JSON.stringify({
                refreshToken: data.refresh_token,
            })),
        ])
            .then(() => data.access_token);
    }

    read() {
        return readFile(constants.ACCESS_TOKEN_JSON, 'utf-8')
            .then(json => {
                const {expiresAt, accessToken} = JSON.parse(json);
                const now = Date.now() / MILLISECONDS;
                if (expiresAt > now + constants.EXPIRATION_MARGIN_SECONDS) {
                    return accessToken;
                } else {
                    return readFile(constants.REFRESH_TOKEN_JSON, 'utf-8')
                        .then(json => {
                            const {refreshToken} = JSON.parse(json);
                            const body = new FormData();
                            body.append('client_id', secrets.CLIENT_ID);
                            body.append('client_secret', secrets.CLIENT_SECRET);
                            body.append('refresh_token', refreshToken);
                            body.append('grant_type', 'refresh_token');
                            return body;
                        })
                        .then(body => fetch('https://www.strava.com/oauth/token', {
                            method: 'POST',
                            body,
                        }))
                        .then(response => response.json)
                        .then(data => this.write(data));
                }
            })
    }
};
