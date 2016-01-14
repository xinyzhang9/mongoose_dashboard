var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
var path = require('path');
app.use(express.static(__dirname + "./static"));
app.set('views',path.join(__dirname,'./views'));
app.set('view engine','ejs');

app.listen(8000,function(){
	console.log("listenning on port 8000...");
})

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/basic_mongoose");

var AnimalSchema = new mongoose.Schema({
	name:String,
	lives:String,
	legs:String,
	updated_at:Date

})
mongoose.model('Animal',AnimalSchema);
var Animal = mongoose.model('Animal');

app.get('/',function(req,res){
	Animal.find({},function(err,animals){
		if(err){
			res.render('error',{errors:err});
		}else{
			res.render('index',{animals:animals})
		}
	})
})

app.post('/',function(req,res){
	Animal.find({},function(err,animals){
		if(err){
			res.render('error',{errors:err});
		}else{
			res.render('index',{animals:animals})
		}
	})
})

app.get('/animals/new_page',function(req,res){
	res.render('new')
})

//remove
app.get('/animals/:id/destroy',function(req,res){
	Animal.remove({_id:req.params.id}, function(err,animal){
		if(err){
			res.render('error',{errors:err});
		}else{
			res.redirect('/');
		}
	})
})
//add animals
app.post('/animals/new',function(req,res){
	console.log("POST DATA",req.body);
	var animal = new Animal(
							{name:req.body.name, 
							lives:req.body.lives, 
							legs:req.body.legs, 
							updated_at:Date()}
							);

	animal.save(function(err){
		if(err){
			console.log('something wrong');
		}else{
			console.log('successfully added a new animal');
			res.redirect('/');
		}
	})
})



//update a single animal
app.post('/animals/:id',function(req,res){

	Animal.update(
					{_id:req.params.id},
					{
						name:req.body.name,
						lives:req.body.lives,
						legs:req.body.legs,
						updated_at:Date()
					},function(err,animal){
						 res.redirect("/");
						});

})

app.get("/animals/:id", function(req, res) {
    Animal.findOne({_id: req.params.id}, function(err, animal) {

        res.render("animal", {animal: animal});
    });
});

app.get("/animals/:id/edit", function(req, res) {
    Animal.findOne({_id: req.params.id}, function(err, animal) {
        console.log("Edit an animal");
        res.render("profile", {animal: animal});
    });
});