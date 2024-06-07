const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const clerkAuth = ClerkExpressRequireAuth({
    audience: process.env.CLIENT_URL,
    authorizedParties: [process.env.CLIENT_URL],
});

module.exports = clerkAuth;