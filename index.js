const express = require('express');
const port =3000;

const app = express();
const bodyParser = require('body-parser');

//
require('./db');
require('./models/User');
require('./models/Freelancer')
require('./models/Recruiter')
require('./models/job')
require('./models/Contract')
//
const LoginRoutes = require('./Routes/LoginRoutes');
const SignupRoutes = require('./Routes/SignupRoutes');
const requireToken = require('./Middlewares/AuthTokenRequired');
const FreelancerProfileRoutes = require('./Routes/FreelancerProfileRoutes');
//

app.use(bodyParser.json());
app.use(LoginRoutes);
//app.use(bodyParser.json());
app.use(SignupRoutes);
app.use(FreelancerProfileRoutes);
//app.use(FreelancerProfileRoutes);
//

app.get('/',requireToken,(req,res)=> {
   console.log(req.user);
   res.send(req.user);
   //sending to client profile data
})


app.listen(port, ()=>{
    console.log('Server is running on port %d',port);
})