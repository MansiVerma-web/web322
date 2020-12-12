var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");

const app = express();
const connectDB = require("./controller/connection");
const session = require("express-session");
const BODY_PARSER = require("body-parser");
app.use(express.static('public'));
//app.use(express.staticProvider(__dirname + '/public'));
var Router = require('router');
const mongoose = require('mongoose');
const UserModel = require("./model/user")
const RoomModel = require("./model/room")
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer")
const bcrypt = require('bcryptjs');

const storage = multer.diskStorage({
    destination: "./public/img/new",
    filename: function (req, file, cb) {
        // we write the filename as the current date down to the millisecond
        // in a large web service this would possibly cause a problem if two people
        // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
        // this is a simple example.
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

var router = Router();
const URI = 'mongodb+srv://mansi_verma_18:Cure123@cluster0.rugm0.mongodb.net/assignment?retryWrites=true&w=majority';
mongoose.connect(
    URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}
)

var expHbs = require('express-handlebars');
const { isBuffer } = require("util");

app.engine('.hbs', expHbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.use(session({
    secret: "adsk,aslf@$%12",
    resave: false,
    saveUninitialized: true
}));



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'intellectual100me@gmail.com',
        pass: 'Secure@22' // naturally, replace both with your real credentials or an application-specific password
    }
});




app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
})

app.set('view engine', 'hbs');

app.use(BODY_PARSER.urlencoded({ extended: true }));
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    const user = req.session.user;
    res.render('home', {
        user: user
    });
});

app.get("/room", (req, res) => {
    RoomModel.find().lean().exec().then(rooms => {


        res.render("roompage",
            {
                rooms: rooms
            });
    })
    // res.render('roompage');
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", (req, res) => {
    let data = req.body;
    let errors = {};
    let correctForm = true;

    if (data.email == "" || data.email.length < 4) {
        correctForm = false;
        errors.email = "Email is invalid";
    }
    if (data.firstName == "" || data.firstName.length < 2) {
        correctForm = false;
        errors.firstName = "First name is invalid";
    }

    if (data.lastName == "" || data.lastName.length < 2) {
        correctForm = false;
        errors.lastName = "Last name is invalid";
    }
    if (data.password == "" || !data.password.match(/[0-9a-zA-Z]{6,12}/)) {
        correctForm = false;
        errors.password = "Password must have 6 to 12 chars and have only letters and numbers";
    }

    if (correctForm) {

        console.log(req.body);

        bcrypt.hash(req.body.password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
            const user = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                email: req.body.email
            })
    
            user.save((error) => {
                if (error)
                    console.log(error);
                else {
                    res.render("signedup", {
                        data: data
                    });
                }
            });
        })
        .catch(err=>{
            console.log(err); // Show any errors that occurred during the process
        });


        

    } else {
        res.render("signup", {
            data: data,
            errors: errors
        });
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/profile", (req, res) => {
    user = req.session.user;
    res.render("userPage", { user: user });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.get("/host", (req, res) => {
    user = req.session.user;

    if (user) {
        if (user.host) {
            RoomModel.find().lean().exec().then(rooms => {


                res.render("hostPage",
                    {
                        user: user,
                        rooms: rooms
                    });
            })

        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});


app.post("/login", (req, res) => {
    const user = req.body;

    console.log(user)

    UserModel.findOne({
        email: user.email
    }).lean().exec().then((foundUser) => {

        if (foundUser) {
            req.session.user = foundUser;

            bcrypt.compare(user.password, foundUser.password).then((result) => {
                if (result) {
                    console.log("Password matches");
    
                    if (foundUser.host) {
                        res.redirect("/host");
                    } else {
                        res.render("userPage",
                            {
                                user: foundUser
                            });
                    }
    
    
    
                } else {
                    res.redirect("/");
                }
            });

          
        } else {
            res.redirect("/");
        }

    });




});
app.post("/view-update", (req, res) => {
    const roomNumber = req.body.id;
    console.log(roomNumber);
    RoomModel.findOne({ _id: roomNumber.toString() }).exec().then(room => {
        room = room.toObject();
        console.log(room);
        res.render("updateRoom", { room: room })
    }).catch(error => console.log(error))


})

app.post("/delete", (req, res) => {
    const roomNumber = req.body.id;
    console.log(roomNumber);
    RoomModel.deleteOne({ _id: roomNumber.toString() }).exec().then(() => {
        res.redirect("/host")
    }).catch(error => console.log(error))


})

app.post("/update-room/", upload.single("pic"), (req, res) => {
    const roomNumber = req.body.id;
    console.log(roomNumber);
    RoomModel.updateOne({ _id: roomNumber }, {
        $set: {
            title: req.body.title,
            detail: req.body.detail,
            price: req.body.price,
            rate: req.body.rate,
            img: req.file.filename
        }
    }).exec().then(room => {
        res.redirect("/host")
    }).catch(error => console.log(error))



})

app.post("/create-room", upload.single("pic"), (req, res) => {
    let data = req.body;


    console.log(data);
    const newRoom = new RoomModel({
        title: req.body.title,
        detail: req.body.detail,
        price: req.body.price,
        rate: req.body.rate,
        img: req.file.filename
    })

    newRoom.save((error) => {
        if (error)
            console.log(error);
        else {
            res.redirect("/")
        }
    });

    // } else {
    //     res.render("signup", {
    //         data: data,
    //         errors: errors
    //     });
    // }
});


app.post("/roompage", upload.single("pic"), (req, res) => {
    console.log(req.body)
    console.log(req.body)
    RoomModel.findOne({ _id: req.body.id }).lean().exec().then(room => {
        console.log(room)
        res.render("bookpage", { room: room })
    })


});

app.post("/book", upload.single("pic"), (req, res) => {

    const user = req.session.user;

    if (user) {
        RoomModel.findOne({ _id: req.body.id }).lean().exec().then(room => {

            let checkout = new Date(req.body.checkout);
            let checkin = new Date(req.body.checkin);
            let days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
            let total = days * room.price;

            let booking = room;
            booking.nights = days;
            booking.total = total;
            booking.checkin = checkin;
            booking.checkout = checkout;
            req.session.booking = booking;

            const mailOptions = {
                from: 'intellectual100me@gmail.com',
                to: user.email,
                subject: 'Booking completed',
                text: `${user.firstName}, Your booking order.
                    
                    Checkin 11 am @
                    ${checkin}
                     to 3pm @
                     ${checkout},
                    at ${room.title}
                    Number of nights: ${days}
                    Total paid: ${total}
                 `
            };



            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            console.log(booking)
            res.render("bookings", {
                room: booking
            })
        })
    } else {
        res.redirect("/")
    }




});


// initialize database and setup http server to listen on HTTP_PORT

// connectDB();

app.listen(HTTP_PORT, () => {
    console.log("Web server is up and running!!!")
});

