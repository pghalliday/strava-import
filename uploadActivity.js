const basename = require('path').basename;
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const log = require('./log');

module.exports = (token, file) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const body = new FormData();
    body.append('file', fs.createReadStream(file), {
        name: 'file',
        filename: basename(file),
        contentType: 'application/octet-stream'
    })
    body.append('data_type', 'fit');

    return fetch('https://www.strava.com/api/v3/uploads', {
        method: 'POST',
        headers,
        body,
    })
        .then(response => response.json())
        .then(response => log({
            step: 'upload',
            file,
            token,
            response,
        }));
};