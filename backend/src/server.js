const express = require('express')

const usersRoutes = require('../src/routes/users.routes')
const app = express()
const port = 8080


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/users',usersRoutes);
app.use('/',(req,res) => {res.send("home page")});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;