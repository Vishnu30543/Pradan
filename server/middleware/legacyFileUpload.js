const fileUpload = require('express-fileupload');

const legacyFileUpload = fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

module.exports = legacyFileUpload;
