const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 5000;
const mongoose = require('mongoose');
const bodyParser =require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport')


//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


//Passport Config
require('./config/passport')(passport);


// Map global promise -  get rid of warning
mongoose.Promise = global.Promise; 


//Connect to mongoose.
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected....'))
  .catch(err => console.log(err));


  //Handlebars MIddleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Static folder
app.use(express.static(path.join(__dirname,'public')));


//Method override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
  }))

app.use(flash());

// Global variables
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_message')
  res.locals.error_msg = req.flash('error_message')
  res.locals.success_msg = req.flash('error')
  next()
})


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


//Importing routes
app.use('/ideas', ideas);
app.use('/users', users);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});