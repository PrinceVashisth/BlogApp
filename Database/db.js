const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Database').
then(console.log('connected')).
catch((E)=>{
    console.log(E);
})