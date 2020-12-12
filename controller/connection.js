// /*
// // require mongoose and setup the Schema
// const mongoose = require("mongoose");

// let Schema = mongoose.Schema;

// // define the user schema
// let userSchema = new Schema({
//     firstName: String,
//     lastName: String,
//     email: {
//         type: String,
//         unique: true
//     },
//     password: String,
//     //employee: {
//       //  type: Boolean,
//         //default: false
//     //}
// });

// let User;

// const pass1 = encodeURIComponent("Cure123");

// // verify the db connection
// module.exports.initialize = function(){
//     return new Promise((resolve, reject)=>{
//         const db = mongoose.createConnection(`mongodb+srv://mansi_verma_18:Cure123@cluster0.gewhb.mongodb.net/assignment?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true });
        
//         db.on('error', (err)=>{
//             console.log("Error accured!");
//             reject(err);
//         });

//         db.once('open', ()=>{
//             //create a collection called "User"
//             //use the above schemas for their layout
//             User = db.model("users", userSchema);
//             console.log("db1 success!");
//             resolve();
//           });
//     });
// }
// */

// const mongoose = require('mongoose');

// const URI = 'mongodb+srv://mansi_verma_18:Cure123@cluster0.rugm0.mongodb.net/assignment?retryWrites=true&w=majority';

// const connectDB = async()=>{
//     await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('db connected');
// };

// module.exports = connectDB;