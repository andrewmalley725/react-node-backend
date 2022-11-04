
const express = require("express");

const cors = require('cors')

let app = express(); 

var path = require("path");

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'Andyman72599',
      database : 'SchoolSchedulingExample'
    }
});

const port = 3001;

app.use(cors())

app.get('/search', (req, res) => {
    let value = req.query.value;
    if (value) 
    knex.select(knex.raw('distinct s.subjectcode as Class_Code, s.subjectname as Class_Name'))
                .from('subjects as s')
                .innerJoin('categories as c', 'c.categoryid', '=', 's.categoryid')
                .whereLike('c.categorydescription', '%' + value + '%')
                .then(result => {
        res.json({data: result});
    });
});

app.get('/dropdown', (req, res) => {
    let categories = [];
    knex.select('CategoryDescription').from('Categories').then(result => {
        for (let i of result){
            categories.push(i['CategoryDescription']);
        }
        res.json({data: categories});
    });
});

app.listen(port, () => console.log('Server is running...'));