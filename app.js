var express = require("express");
var path = require("path");
var bodyParser = require("body-parser"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override")

var mongoose = require("mongoose");
var Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seed")

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index"),
    contactRoutes = require("./routes/contact")

mongoose.connect("mongodb://localhost/yelp_camp_v15");

var app = express();

app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
//app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "once again wis!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));       
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use( indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/contact", contactRoutes);

app.listen(3000, function(){
    console.log("YELP camp!!!");
});

//app.listen(process.env.PORT, process.env.IP, function(){

//});