var express = require('express');
var router = express.Router();

router.route('/cabinet').
get(function(req, res){
    if(req.user) {
        Task.find({"creator": {$eq: req.user.id}}).lean().exec(function(err, data){
            if(err) {
                res.render('error');
            }
            if(data) {
                res.render('cabinet', data);
            } else {
                res.render('error');
            }
        });
    }
});

module.exports = router;