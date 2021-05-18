const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 5000;
const mongoose = require('mongoose');
const bodyParser =require('body-parser');


// Map global promise -  get rid of warning
mongoose.Promise = global.Promise; 


//Connect to mongoose.
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected....'))
  .catch(err => console.log(err));


// Load Idea Model 
require('./models/Idea');
const Idea = mongoose.model('ideas');


//Handlebars MIddleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/',(req,res)=> {
  const title = 'Welcome';
  res.render('index',{
    title: title
  });
})

//About Route
app.get('/about',(req,res)=> {
  res.render('about');
})


// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
   .sort({date:'desc'})
   .then(ideas => {
    res.render('ideas/index',{
      ideas: ideas
    })
   })
});


//Add Idea Form
app.get('/ideas/add',(req,res)=> {
  res.render('ideas/add');
})


//Edit Idea Form
app.get('/ideas/edit/:1',(req,res)=> {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea =>{
    res.render('ideas/edit',{
      idea: idea
    })
  })  
})


//Process Form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title.'})
  }
  
  if(!req.body.details){
    errors.push({text: 'Please add some details.'})
  }

  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  }

  else{
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});