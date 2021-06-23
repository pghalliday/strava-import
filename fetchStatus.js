const fetch = require('node-fetch');
const log = require('./log');

module.exports = (token, id, attempt, file) => fetch(`https://www.strava.com/api/v3/uploads/${id}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
})
    .then(response => response.json())
    .then(response => log({
        step: 'status',
        file,
        id,
        attempt,
        token,
        response
    }));
