const express = require("express");
const app = express();
const path = require("path");
// var router = express.Router();
const port = process.env.PORT || 3000;
require("./db/conn");
const hbs = require("hbs");
const Register = require("./models/UserData");
const Blog = require("./models/BlogData");

const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");


app.get("/", (req, res) => {
    Register.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("index", {
                user: doc
            });
        } else {
            console.log('Error in retrieving employee list :' + err);
        }

    });
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/blog_write", (req, res) => {
    res.render("blog_write");
});
app.post("/blog_write", async(req, res) => {
    try {
        const username = req.body.username;
        const user_blog = await Blog.findOne({ username: username });
        const user_cred = await Register.findOne({ username: username });

        const blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            username: req.body.username
        });

        const blogs = await blog.save();
        res.status(201).render("/", {
            user_blog: user_blog
        });

    } catch (error) {
        res.status(400).send("cath me aa gaya");
    }
});


app.get('/:id', (req, res) => {
    Register.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("userDashboard", {
                user: doc
            });
        } else {
            console.log('Error in retrieving employee list :' + err);
        }

    });
});





app.post("/signin", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const uname = await Register.findOne({ username: username });
        const user_blog = await Blog.find({ username: username });
        if (uname.password === password) {
            res.status(201).render("userDashboard", {
                uname: uname,
                user_blog: user_blog
            });
        } else {
            res.send("password incorrect");
        }
    } catch (error) {
        res.status(400).send("username not found");
    }
});

app.post("/signup", async(req, res) => {
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
                cnf_pass: req.body.cnf_pass,
            });

            const registered = await user.save();
            res.status(201).render("index");
        } else {
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});



app.listen(port, () => {
    console.log("port");
});