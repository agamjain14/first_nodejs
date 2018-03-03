var middlewareObj = {};
var Campground = require("../models/campground")
var Comment = require("../models/comment")

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)|| req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "permission denied");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "you need to be logged in");
        res.redirect("back");
    } 
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "permission denied");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "you need to be logged in");
        res.redirect("back");
    } 
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please Login!!!");
    res.redirect("/login");
}


module.exports = middlewareObj;