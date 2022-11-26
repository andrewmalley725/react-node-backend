
const express = require("express");

const cors = require('cors');

let app = express(); 

var path = require("path");

app.use(express.urlencoded());

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'Andyman72599', // change before running server
      database : 'SchoolSchedulingExample'
    }
});

const port = 3001;

app.use(cors());

app.get('/classes', (req, res) => {
    let classes = [];
    let value = '';
    if (req.query.value){
        value = req.query.value;
    }
    console.log(value);
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

app.get('/semesters', (req,res) => {
    let semesters = [];
    knex.select(knex.raw('distinct semesternumber')).from('classes').then(result => {
        for (let i of result){
            if (i['semesternumber'] == 1){
                semesters.push('Fall');
            }
            else{
                semesters.push('Winter');
            }
        }
        res.json(semesters);
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

app.get('/info/:sel/:sem', (req, res) => {
    let name = req.params.sel.split('-')[1];
    let sem = req.params.sem;
    knex.select('cl.classid', 'Course', 'Name').from('classoverview as cl')
                                            .innerJoin('classes as c', 'c.classid', '=', 'cl.classid')
                                            .where('semesternumber', sem)
                                            .andWhereLike('Name', name + '%')
                                            .then(result =>{
        res.json({data: result});
    });
});

app.get('/viewcourse', (req, res) => {
    let data = [];
    let classid = req.query.classid;
    knex.select().from('classoverview as cl')
                .innerJoin('classes as c', 'c.classid','=','cl.classid')
                .where('c.classid',classid)
                .then(result => {
                                for (let i of result){
                                    let weekSched = '';
                                    let days = 0;
                                    if (i['MondaySchedule'][0] == 1){
                                        weekSched += ('M');
                                        days += 1;
                                    }
                                    if (i['TuesdaySchedule'][0] == 1){
                                        weekSched += ('T');
                                        days += 1;
                                    }
                                    if (i['WednesdaySchedule'][0] == 1){
                                        weekSched += ('W');
                                        days += 1;
                                    }
                                    if (i['ThursdaySchedule'][0] == 1){
                                        weekSched += ('TH');
                                        days += 1;
                                    } 
                                    if (i['FridaySchedule'][0] == 1){
                                        weekSched += ('F');
                                        days += 1;
                                    }
                                    if (i['SaturdaySchedule'][0] == 1){
                                        weekSched += ('SAT');
                                        days += 1;
                                    }
                                    data.push({
                                        course:i['Course'] + ' - ' + i['Name'],
                                        semester:i['SemesterNumber'] == 1 ? 'Fall' : 'Winter',
                                        taughtBy:i['Taught_by'],
                                        schedule:weekSched,
                                        time:i['StartTime']
                                    });
                                }
        res.json({'data':data})
    })
});

app.listen(port, () => console.log('Server is running...'));

