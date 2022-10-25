const express = require("express");

const cors = require('cors')

let app = express(); 

var path = require("path");

const port = 3001;

app.use(cors())

app.get('/api', (req, res) => {
    let name = req.query.name;
    let email = req.query.email;
    res.json({
        message: name + ' will be contacted at ' + email
    })
});

app.listen(port, () => console.log('Server is running...'));