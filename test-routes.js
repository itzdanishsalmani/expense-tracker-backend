require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
app.use(passport.initialize());

const authRoute = require('./src/routes/authRoute').default;
app.use('/auth', authRoute);

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log("APP ROUTE:", r.route.path)
  } else if (r.name === 'router') {
    console.log("APP ROUTER:", r.regexp)
    r.handle.stack.forEach(sub => {
       if(sub.route) console.log("  ->", sub.route.path)
    });
  }
})
