const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 5000;
const mongoose = require('mongoose');
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


app.get('/',(req,res)=> {
  const title = 'Welcome';
  res.render('index',{
    title: title
  });
})
app.get('/about',(req,res)=> {
  res.render('about');
})
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});