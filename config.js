'use strict';
var url = process.env.MONGOLAB_URI;
// var url = "mongodb://localhost:27017/codetogether";
module.exports = {
    mailer: {
        service: 'Gmail',
        auth: {
            user: 'youremail',
            pass: 'yourpass'
        }
    },
    dbConnstring: url,
    sessionKey: 'Hallo'
};