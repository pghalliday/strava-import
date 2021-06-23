const fetchStatus = require('./fetchStatus');
const AccessToken = require('./AccessToken');

const accessToken = new AccessToken();
const ID = '5874254840';
const FILE = 'file';

accessToken.read()
.then(token => fetchStatus(token, ID, 0, FILE))
