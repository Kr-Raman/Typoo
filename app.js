const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
require('./db/conn')
const hbs = require('hbs');
const Register = require("./models/UserData");


const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "hbs");
app.get('/', (req, res) => {
    res.render("index")
});
app.get('/signup', (req, res) => {
    res.render("signup")
});
app.post('/signup', async(req, res) => {
    try {
        // console.log(req.body.first_name);
        // res.send(req.body.first_name);
        const pass = req.body.password;
        const cnf_pass = req.body.cnf_pass;
        if (pass === cnf_pass) {

            const user = new Register({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email_id: req.body.email_id,
                username: req.body.username,
                password: req.body.password,
                cnf_pass: req.body.cnf_pass
            })

            const registered = await user.save();
            res.status(201).render("index");

        } else {
            res.send("password are not matching")
        }





    } catch (error) {
        res.status(400).send(error)
    }
});

app.listen(port, () => {
    console.log("port");
})