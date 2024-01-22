var express = require('express');
var router = express.Router();
const userModel = require("./users")
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post("/register", function(req, res ){
  var userData = new userModel({
    username:req.body.username,
    email:req.body.email,
    name: req.body.name,
    surname:req.body.surname,
    dateofbirth:req.body.dateofbirth,
    secret:req.body.secret,
  });
  userModel.register(userData, req.body.password).then(function(registeredUser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })

});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect:"/login"
}), function(re, req){});

router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect("/profile")
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
res.redirect("/profile")
}


module.exports = router;
