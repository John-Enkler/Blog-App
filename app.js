var express       = require("express");
var methodOverride= require("method-override");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var expressSanitizer = require("express-sanitizer");
//configure mongoose
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser:true});

//sets view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Mongoose/model config
var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date, 
    default:Date.now
  }
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful ROUTES
app.get("/", function(req, res){
  res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("ERROR!");
    } else{
      res.render("index", {blogs: blogs});
    }
  });
});
 //NEW ROUTE
 app.get("/blogs/new",function(req, res){
  res.render("new");
});
//Create Route
app.post("/blogs", function(req, res){
  app.post(req.body.blog.body = req.sanitize(req.body.blog.body));
  //create blog
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    }else{
      res.redirect("/blogs");
    }
  });
  //redirect to index
});

//Show
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } 
    else{
      res.render("show", {blog: foundBlog});
    }
  });
});

//Edit
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } 
    else{
      res.render("edit", {blog: foundBlog});
    }
  });
});

//Update
app.put("/blogs/:id", function(req, res){
  app.post(req.body.blog.body = req.sanitize(req.body.log.body));
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Destroy
app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});



app.listen(3000, function(){
  console.log("Server is Connected!");
});