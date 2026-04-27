const { Sequelize } = require('sequelize');
const path = require('path');

// Both Vercel and Render free tier have read-only filesystems except /tmp
const isServerless = process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.RENDER;
const storagePath = isServerless
    ? path.join('/tmp', 'dress-website.sqlite')
    : path.join(__dirname, '..', 'dress-website.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
});

module.exports = sequelize;
