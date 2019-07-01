const express = require('express');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcrypt');
const mysql = require('mysql');
const shortid = require('shortid');
const tocken = require('jsonwebtoken');
const config = require('./config');
const auth = require('./auth');

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: false
}));
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'mini_project'
});
const server = app.listen(5000, function(){
    console.log('server is running');

});

connection  .connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });

app.get('/', function(req, res){
	res.sendFile('./html/index.html', {root: __dirname});
});

app.post('/register', function(req,res){
    let userName = req.body.userName;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let title = req.body.title;
    let userID = shortid.generate();
    let avetarURL = ('/user/' + userID);
    let password = bcrypt.hash(req.body.password,10,function(err, hash){
        let sql0 ="SELECT * from users WHERE username='"+userName+"'";
        connection.query(sql0, function(err,result){
            let size = result.length;
        if (size<1){
            let sql = "INSERT INTO users (userID, title, userName, password, firstName, lastName, avetarURL  ) VALUES ('"+userID+"', '"+title+"', '"+userName+"', '"+hash+"', '"+firstName+"', '"+lastName+"', '"+avetarURL+"')";
            connection.query(sql);

            res.sendFile('./html/login.html',{root: __dirname});
        }

        else {
            res.send({message: "User exsixts"});
        }
    });
    });
});

app.get('/user/:id', function(req,res){
    let userID = req.params.id;

    let sql = "SELECT * FROM users WHERE userID = '"+userID+"'";
    connection.query(sql, function(err, result){
        if(err) throw err;
        res.json(result);
    });
});

app.get('/login', function(req,res){
    res.sendFile('./html/login.html',{root:__dirname});
});

app.post('/logged', function(req,res,next){
    let userName = req.body.userName;
    let password = req.body.password;
    let sql = "SELECT * FROM users WHERE username ='"+userName+"'";
    connection.query(sql, function(err, result){
        if(err) throw err;
        bcrypt.compare(password,result[0].password).then(isMatch=>{
            if(isMatch){
                var token = jwt.sign({ userID:result[0].userID,username:result[0].username },config.secret, {
                    expiresIn: 86400
                  });
                res.status(200).send({token});
            }
            else{
                return res.status(400)
                    .json({passwordincorrect:"password incorrect"});
            }
        });
    });
});

app.get("/create", auth, function(req,res,next){
    let sql = "SELECT * FROM users WHERE userID='"+req.data.userID+"'";
    connection.query(sql, function(err,result){
        if(result.length==1){
            res.sendFile('./html/post.html',{root:__dirname});
        }

        else{
            return res.status(400)
                    .json({passwordincorrect:"Access Deinied"});
        }
    });
});


app.post('/post',auth, function(req,res){

    let content = req.body.content;
    let title = req.body.title;
    let userID = req.data.userID;
    
    let sql="INSERT INTO posts (userID,title,content) VALUES ('"+userID+"','"+title+"','"+content+"')";
    connection.query(sql, function(err,result){
        res.status(200).json({Content : content,Title : title, User_ID: userID, Created_by : req.data.username });
    });


});