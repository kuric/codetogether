'use strict';
var url = process.env.MONGOLAB_URI;
// var url = "mongodb://localhost:27017/codetogether";
module.exports = {
    mailer: {
        service: 'Gmail',
        auth: {
            user: 'js.portfolio.demo@gmail.com',
            pass: 'K12rnu7op'
        }
    },
    dbConnstring: url,
    sessionKey: 'Hallo'
};