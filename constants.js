module.exports = {
    ACCESS_TOKEN_JSON: 'access-token.json',
    REFRESH_TOKEN_JSON: 'refresh-token.json',
    STATUS_INTERVAL: 2000,
    AUTHORIZATION_PORT: 3000,
    AUTHORIZATION_SCOPE: [
        'read',
        'read_all',
        'profile:read_all',
        'profile:write',
        'activity:read',
        'activity:read_all',
        'activity:write',
    ].join(','),
    EXPIRATION_MARGIN_SECONDS: 120,
};
