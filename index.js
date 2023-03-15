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

//
const LoginRoutes = require('./Routes/LoginRoutes');
const SignupRoutes = require('./Routes/SignupRoutes');
const requireToken = require('./Middlewares/AuthTokenRequired');
const ProfileRoutes = require('./Routes/ProfileRoutes');
const RecruiterRoutes = require('./Routes/RecruiterRoutes');
const FreelancerRoutes =require('./Routes/FreelancerRoutes');
//

app.use(bodyParser.json());
app.use(LoginRoutes);
//app.use(bodyParser.json());
app.use(SignupRoutes);
app.use(ProfileRoutes);
app.use(RecruiterRoutes);
app.use(FreelancerRoutes);
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