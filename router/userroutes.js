const express=require('express')
const route=express.Router();
let usermodel = require('../model/usermodel')
const {storeUserData} = require('../userjs/storeUserData')
const {validateUser} = require('../userjs/validateUser')
const bcrypt=require('bcrypt')
const session = require('express-session');
const authMiddleware = require('../middleware/authmid');


route.get('/usersignin', (req, res) => {
    res.render('usersignin', { errorMessage: null });
});


route.get('/usersignup',async(req,res)=>{
    res.render('usersignup')
})

route.post('/usersignup',async(req,res)=>{
    if(req.body.email && req.body.password ){
    req.session.email = req.body.email;
    req.session.password = await bcrypt.hash(req.body.password, 10); // Hash the password
    req.session.loggedIn = true;
    res.redirect('/userinfo');
    }
    else{
        res.send('please enter email and password')
    }
})

route.post('/usersignin', async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        role:'client'
    };

    const result = await validateUser(data);
    req.session.user=result.user;
    if (result.success) {
        req.session.loggedIn = true;
        console.log(result.user)
        res.redirect(result.redirectTo);
    } else {
        res.render('usersignin', { errorMessage: result.message });
    }
});

route.get('/userinfo', authMiddleware, async (req, res) => {
    res.render('userinfo');
})


route.post('/userinfo',authMiddleware, async (req, res) => {
    req.body.email = req.session.email;
    req.body.password = req.session.password;
    const result = await storeUserData(req, res);
    if (result.success) {
        res.redirect('/home');
    } else {
        res.send('Sorry, try again later.');
    }
});

route.get('/home', authMiddleware, (req, res) => {
    res.render('homes2')
});

route.get('/userprofile',authMiddleware,async (req, res) => {
    if (req.session.user && req.session.user.email) {
      const worker = await usermodel.findOne({ email: req.session.user.email });
      if(worker){
      console.log(worker); // Log to ensure data is being fetched
      res.render('profile', { worker });
      }
    } else {
      res.redirect('/who');
    }
  });
  


module.exports = route;