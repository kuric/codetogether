var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Together' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Code Together' });
});

router.route('/contact')
  .get(function(req, res, next) {
    res.render('contact', { title: 'Code Together' });
  })
  .post(function(req, res, next) {
  
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    // return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    res.render('contact', {
      title: 'ShareCode',
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      error: "Please select captcha"
    });
  }
  var secretKey = "6Ld6kV4UAAAAAC_1rJoscS61v8z3BIUocexwRVrv";
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      res.render('contact', {
        title: 'Code Together',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        error: "Please select captcha"
      });
    }
    req.checkBody('name','Empty Name').notEmpty();
    req.checkBody('email','Invalid Email').isEmail();
    req.checkBody('message','Empty Message').notEmpty();
    var errors = req.validationErrors();

    if(errors) {
      res.render('contact', {
        title: 'Code Together',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    } else {
      var mailOptions = {
        from: 'Code Together',
        to: 'gallskiy@gmail.com',
        subject: 'You got new message 🐥 from visitor: ' + req.body.name + ', email: ' + req.body.email,
        text: req.body.message
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
          return console.log(error);
        }
        return res.render('thank', { title: 'Code Together' });
      });
     
    }
  });
    
  });

 
module.exports = router;
