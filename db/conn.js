const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://raghav:Raghav@1@cluster0.5diwb.mongodb.net/typoo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection succ");
}).catch(() => {
    console.log("no conn")
})