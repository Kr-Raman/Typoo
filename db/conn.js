const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Typoo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection succ");
}).catch(() => {
    console.log("no conn")
})