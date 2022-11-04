
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

app.get('/classes', (req, res) => {
    let classes = [];
    let value = '';
    if (req.query.value){
        value = req.query.value;
    }
    knex.select(knex.raw('distinct s.subjectcode as Class_Code, s.subjectname as Class_Name'))
                .from('subjects as s')
                .innerJoin('categories as c', 'c.categoryid', '=', 's.categoryid')
                .whereLike('c.categorydescription', '%' + value + '%')
                .then(result => {
        for (let i of result){
            classes.push(i['Class_Code'] + '-' + i['Class_Name'])
        }
        res.json({data: classes});
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

app.get('/info', (req, res) => {
    let name = '';
    if (req.query.class){
        name = req.query.class.split('-')[1];
    }
    knex.select('c.classid', 's.subjectname', 's.subjectcode').from('subjects as s')
                 .innerJoin('classes as c', 'c.subjectid', '=', 's.subjectid')
                 .whereLike('s.subjectname', '%' + name)
                 .then(result =>{
        res.json({data: result});
    });
});

app.listen(port, () => console.log('Server is running...'));