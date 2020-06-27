const expressJwt = require('express-jwt');
const config = require('./dbconfig.json');
const userService = require('../_authApi/auth.service');
module.exports = jwt;

function jwt() {
    const { secret } = config;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // Public routes that don't require authentication
            '/authentication/login',
            '/authentication/newadmin',
            '/authentication/newuser',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);
    // Revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    done();
};