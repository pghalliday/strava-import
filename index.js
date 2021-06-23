const from = require('rxjs').from;
const interval = require('rxjs').interval;
const mergeMap = require('rxjs/operators').mergeMap;
const uploadActivity = require('./uploadActivity');
const fetchStatus = require('./fetchStatus');
const constants = require('./constants')
const AccessToken = require('./AccessToken');

const accessToken = new AccessToken();

const token = from(accessToken.read())
const statuses = token.pipe(mergeMap(token => {
    const files = from(['10129054_UNKNOWN.fit'])
    const uploadSteps = files.pipe(mergeMap(file => uploadActivity(token, file)));
    return uploadSteps.pipe(mergeMap(uploadStep => {
        const source = interval(constants.STATUS_INTERVAL);
        return source.pipe(mergeMap(attempt => fetchStatus(token, uploadStep.response.id, attempt, uploadStep.file)));
    }));
}));
statuses.subscribe();
