
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
      password : '**********',
      database : 'SchoolSchedulingExample'
    }
});

const port = 3001;

app.use(cors())

app.get('/search', (req, res) => {
    let searchValue = req.query.value;
    if (searchValue){
        knex.select(knex.raw("concat(Subjects.CategoryID, ' ', Classes.ClassID) as Class_name"), 'Categories.CategoryDescription as Subject')
                    .from('Classes')
                    .innerJoin('Subjects', 'Subjects.SubjectID', '=', 'Classes.SubjectID')
                    .innerJoin('Categories', 'Categories.CategoryID', '=', 'Subjects.CategoryID')
                    .whereLike('Categories.CategoryDescription', '%' + searchValue + '%')
                    .then(result => {
            res.json({data: result});
        });
    }
    else{
        knex.select(knex.raw("concat(Subjects.CategoryID, ' ', Classes.ClassID) as Class_name"), 'Categories.CategoryDescription as Subject')
                    .from('Classes')
                    .innerJoin('Subjects', 'Subjects.SubjectID', '=', 'Classes.SubjectID')
                    .innerJoin('Categories', 'Categories.CategoryID', '=', 'Subjects.CategoryID')
                    .then(result => {
            res.json({data: result});
        });
    }
});

app.listen(port, () => console.log('Server is running...'));