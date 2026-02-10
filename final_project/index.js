const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const { authenticatedUser } = require('./router/auth_users.js'); 
const { users } = require('./router/auth_users.js');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.post("/customer/login", (req, res) => {   // <<< ADDED
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });

        req.session.authorization = { accessToken, username };
        return res.status(200).json({ message: "User successfully logged in" });
    }

    return res.status(401).json({ message: "Invalid login. Check username and password" });
}); 


app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const token = req.session.authorization.accessToken;

    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
