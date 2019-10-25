var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//mongoose setup
mongoose.connect("mongodb://127.0.0.1:27017/moviedb");
var movieSchema = mongoose.Schema({
  title: String,
  desc: String,
  length: Number
});
var Movie = mongoose.model("Movie", movieSchema);

//routes
app.get("/", function(req, res) {
  res.redirect("/movies");
});

app.get("/movies", function(req, res) {
  Movie.find(function(err, movies) {
    if (!err) {
      res.render("index.ejs", { movies: movies });
    }
  });
});

app.get("/movies/new", function(req, res) {
  res.render("new.ejs");
});

app.post("/movies", function(req, res) {
  Movie.create(req.body.movie, function(err, movie) {
    if (!err) {
      res.redirect("/movies");
    }
  });
});

app.get("/movies/:id", function(req, res) {
  Movie.findById(req.params.id, function(err, movie) {
    if (!err) {
      res.render("show.ejs", { movie: movie });
    }
  });
});

app.get("/movies/:id/edit", function(req, res) {
  Movie.findById(req.params.id, function(err, movie) {
    if (!err) {
      res.render("edit.ejs", { movie: movie });
    }
  });
});

app.put("/movies/:id", function(req, res) {
  Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, movie) {
    if (!err) {
      res.redirect("/movies/" + req.params.id);
    }
  });
});

app.delete("/movies/:id", function(req, res) {
  Movie.findByIdAndDelete(req.params.id, function(err, movie) {
    if (!err) {
      console.log("entry deleted");
      res.redirect("/movies");
    }
  });
});

app.listen(3000, function() {
  console.log("server up");
});
