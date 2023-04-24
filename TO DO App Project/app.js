const express = require('express');
// Path is require to get the location of our view folder 
const path = require('path');
const port = 9000;

// connecting database
const db = require('./config/mongoose');
const Task = require('./models/task');

// This is app variable will have all the functionality of above 2 lines of code
const app = express();

// It is require to set up our template engine
app.set('view engine','ejs');

// Using middleware to add the css folder in home.ejs file
app.use(express.static('views'));

// This step will give the path of our view page
//dirname make our folder dynamic and look out for folder name views
app.set('views',path.join(__dirname,'views')); 

//  Middleware 
app.use(express.urlencoded());


// creating an TODO List
// creating an controller for displaying are todo list
app.get('/',function(req,res){
// fetching the data from db and adding to are template
    Task.find({},function(err,todoList){
        if (err){
            console.log('Error in fetching taks from db');
            return;
        }
        
        return res.render('home',{
            title:"TODO App",
            todo_list: todoList
        });

    });

});

// creating an Todo List Task 
app.post('/create-todoList',function(req,res){
    // sending datae to DB to creating an task an to save it 
    Task.create({
        description : req.body.description,
        category: req.body.category,
        date: req.body.date
    }, function(err,newTask){
        if (err){
            console.log('error in creating an contact');
            return;
        }

        console.log('********',newTask);
        return res.redirect('back');
    });

});

// creating an delete
app.get('/delete-todoList',function(req,res){
    var id = req.query;

    // checking the number of tasks selected to delete
    var count = Object.keys(id).length;
    for(let i=0; i < count ; i++){
        
        // finding and deleting tasks from the DB one by one using id
        Task.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('error in deleting task');
            }
        })
    }
    return res.redirect('back'); 
});

app.listen(port, function (error) {
    if (error) {
        console.log("Error in running the server", error);
    }
    console.log("Yup!My Express Server is runnig on Port", port);
})