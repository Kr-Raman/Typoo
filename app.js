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

    res.render("index")

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

app.post('/blog_write', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var blog = new Blog();
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = req.body.author;
    blog.username = req.body.username;

    blog.save((err, doc) => {
        if (!err)
            res.render('signin');
        else
            console.log("error in saving data");
    });
}

function updateRecord(req, res) {
    Blog.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.render('signin');
        } else
            console.log('Error during record update : ' + err);

    });
}







// app.post("/blog_write", async(req, res) => {
//     try {
//         const username = req.body.username;
//         console.log(username);


//         const blog = new Blog({
//             title: req.body.title,
//             content: req.body.content,
//             author: req.body.author,
//             username: req.body.username,
//         });

//         const blogs = await blog.save();
//         const user_blog = await Blog.find({ username: username });
//         const user_cred = await Register.findOne({ username: username });
//         res.status(201).render("userDashboard", {
//             user_blog: user_blog,
//             user_cred: user_cred,
//         });
//     } catch (error) {
//         res.status(400).send("cath me aa gaya");
//     }
// });
// //
// async function insertRecord(req, res) {
//     try {
//         const username = req.body.username;
//         const user_blog = await Blog.find({ username: username });
//         const user_cred = await Register.findOne({ username: username });

//         const blog = new Blog({
//             title: req.body.title,
//             content: req.body.content,
//             author: req.body.author,
//             username: req.body.username,
//         });

//         const blogs = await blog.save();
//         res.status(201).render("userDashboard", {
//             user_blog: user_blog,
//         });
//     } catch (error) {
//         res.status(400).send("cath me aa gaya");
//     }
// }

// function updateRecord(req, res) {
//     Blog.findOneAndUpdate({ _id: req.body._id }, (err, doc) => {
//         if (!err) {
//             res.redirect("index");
//         }
//     });
// }
//UPDATE
app.get("/blog_write/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("blog_write", {
                doc: doc
            });
        }
    });



    // console.log(id);
    // Blog.findOneAndUpdate({ _id: req.params.id },
    //     req.body, { new: true },
    //     (err, doc) => {
    //         if (!err) {
    //             console.log(req.body);
    //             res.render("blog_write");
    //             doc: req.body

    //         }
    //     }
    // );
});

//DELETE
app.get("/delete/:id", (req, res) => {

    Blog.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.status(201).render("signin");

        } else {
            console.log("Error in blog delete :" + err);
        }
    });
});

// app.get("/:id", (req, res) => {
//   Register.findById(req.params.id, (err, doc) => {
//     if (!err) {
//       res.render("blog_write", {
//         user: doc,
//       });
//     } else {
//       console.log("Error in retrieving employee list :" + err);
//     }
//   });
// });

app.post("/signin", async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user_cred = await Register.findOne({ username: username });
        const user_blog = await Blog.find({ username: username });
        if (user_cred.password === password) {
            res.status(201).render("userDashboard", {
                user_cred: user_cred,
                user_blog: user_blog,
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

if (process.env.NODE_ENV === 'production') {


}

app.listen(port, () => {
    console.log("port");
});