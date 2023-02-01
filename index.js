const express = require('express');
const port =3000;

const app = express();
const bodyParser = require('body-parser');

//
require('./db');
require('./models/User');
//
const LoginRoutes = require('./Routes/LoginRoutes');
const SignupRoutes = require('./Routes/SignupRoutes');
const requireToken = require('./Middlewares/AuthTokenRequired');
//

app.use(bodyParser.json());
app.use(LoginRoutes);
app.use(bodyParser.json());
app.use(SignupRoutes);
//

app.get('/',requireToken,(req,res)=> {
   console.log(req.user);
   res.send(req.user);
   //sending to client profile data
})


app.listen(port, ()=>{
    console.log('Server is running on port %d',port);
})