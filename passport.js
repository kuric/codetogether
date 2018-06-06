var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user._id)
});

passport.deserializeUser(function (id,done){
    User.findOne({_id: id}, function(error, user){
        done(error, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(username, password, done) {
        User.findOne({email: username}, function(error, user){
            if(error) return done(error);
            if(!username) {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
            if(!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
            return done(null, user);
        })
    }
));