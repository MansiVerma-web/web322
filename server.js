var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
path = require( 'path' );
const app = express();

const BODY_PARSER = require("body-parser");
app.use(express.static('public'));
//app.use(express.staticProvider(__dirname + '/public'));
var Router = require('router');
 

var router = Router();

var expHbs = require('express-handlebars');

app.engine('.hbs', expHbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));

app.set('view engine', 'hbs');

app.use(BODY_PARSER.urlencoded({extended: true}));
// setup a 'route' to listen on the default url path
app.get("/", (req, res)=>{
    res.render('home');
});

app.get("/room", (req, res)=>{
    res.render('roompage');
});

app.get("/signup", (req, res)=>{
    res.render("signup");
});

app.post("/signup", (req, res)=>{
    let data = req.body;
    let errors = {};
    let correctForm = true;

    if(data.email == "" || data.email.length < 4){
        correctForm = false;
        errors.email = "Email is invalid";
    }
    if(data.firstName == "" || data.firstName.length < 2){
        correctForm = false;
        errors.firstName = "First name is invalid";
    }

    if(data.lastName == "" || data.lastName.length < 2){
        correctForm = false;
        errors.lastName = "Last name is invalid";
    }
    if(data.password == "" || !data.password.match(/[0-9a-zA-Z]{6,12}/)){
        correctForm = false;
        errors.password = "Password must have 6 to 12 chars and have only letters and numbers";
    }

    if(correctForm){
        res.render("signedup", {
            data: data
        });
    } else {
        res.render("signup", {
            data: data,
            errors: errors
        });
    }
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{
    console.log("Web server is up and running!!!")
});

