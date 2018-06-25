var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');

router.route('/login')
.get(function(req, res, next) {
    res.render('login', { title: 'Login' });
  })
  .post(passport.authenticate('local',{
      failureRedirect: '/login'
  }), function (req, res) {
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        res.render('login', {
          title: 'Code Together',
          email: req.body.email,
          password: req.body.password,
          error: "Please select captcha"
        });
      } else {
        var secretKey = "6Ld6kV4UAAAAAC_1rJoscS61v8z3BIUocexwRVrv";
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
              res.render('login', {
                title: 'Code Together',
                email: req.body.email,
                error: "Please select captcha"
              });
            }
            res.redirect('/');
        });
      } 
        
    }
);

router.route('/register')
.get(function(req, res, next) {
    res.render('register', { title: 'Register new account' });
  })
.post(function(req, res, next) {
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        res.render('register',{
            title: 'Register new account',
            name: req.body.name,
            email: req.body.email,
            error: "Please select captcha"
        })
    } 
    var secretKey = "6Ld6kV4UAAAAAC_1rJoscS61v8z3BIUocexwRVrv";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
            res.render('register',{
                name: req.body.name,
                email: req.body.email,
                error: "Please select captcha"
            })
        }
        req.checkBody('name','Empty Name').notEmpty();
        req.checkBody('email','Invalid Email').isEmail();
        req.checkBody('password','Empty Password').notEmpty();
        req.checkBody('password','Password do not match').equals(req.body.confirmpassword).notEmpty();
    
        var errors = req.validationErrors();
        if(errors) {
            res.render('register',{
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            })
        } else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save(function (err) {
                if(err) {
                   return  res.render('register',{
                        errorMessages: err
                    });
                } else {
                    return res.redirect('/login');
                }         
            })
        }
    });
   
});

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

module.exports = router;