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
//

app.use(bodyParser.json());
app.use(LoginRoutes);
app.use(bodyParser.json());
app.use(SignupRoutes);
//

app.get('/',(req,res)=> {
    res.send('This is home page');
})


app.listen(port, ()=>{
    console.log('Server is running on port %d',port);
})