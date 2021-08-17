const express =require('express')
import UserRoutes from './routes/users'
const bodyParser = require('body-parser');

const app=express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));
app.use((req:any,res:any,next:any)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.use(UserRoutes);
app.listen(3000)