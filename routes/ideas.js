const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth')
module.exports = router;



// Load Idea Model 
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({})
   .sort({date:'desc'}).lean()
   .then(ideas => {
     console.log('ideas',ideas)
    res.render('ideas/index',{
      ideas: ideas
    })
   })
   .catch(err => console.log(err))
});


//Add Idea Form
router.get('/add', ensureAuthenticated, (req,res)=> {
  res.render('ideas/add');
})


//Edit Idea Form
router.get('/edit/:id',ensureAuthenticated, (req,res)=> {
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
router.post('/', ensureAuthenticated,  (req, res) => {
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
        req.flash('success_msg','Video idea updated.')
        res.redirect('/ideas');
      })
  }
});


//Edit form process
router.put('/:id', (req, res) => {
   Idea.findOne({
     _id: req.params.id
   })
   .then(idea => {
     //new values
     idea.title = req.body.title
     idea.details = req.body.details

     idea.save()
      .then(idea => {
        res.redirect('/ideas')
      })
   })
});


//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(() => {
    req.flash('success_msg','Video idea removed')
    res.redirect('/ideas')
  })
  
});
