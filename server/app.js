const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const request = require('request');

const PORT = process.env.PORT || 3010;
const app = express();

let options = {
    host: 'remotemysql.com',
    user: 'mMzhSPN62d',
    port: 3306,
    password: 'XzDYIkINla',
    database: 'mMzhSPN62d'
};

let connection = mysql.createPool(options);


//let corsOptions = {
 //   origin: ['https://samokhindmitro.github.io/cargochina', 'http://mycargo.zzz.com.ua'],
 //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//};

//app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req,res) {
   res.send('home');
});

app.get('/about', (req,res) => {
   res.send('About');
});

app.get('/user/:id', (req,res) => {
    console.log(req.query.name);
    console.log(req.query.trast);
   res.send(`User ${req.params.id} а также его параметры ${req.query.name}`);
});

app.get('/clients', (req,res) => {
    connection.query('SELECT * FROM clients', function(error, rows) {
        if(error) throw new  Error(error);
        res.send(rows);
    });
});

app.post('/clients', (req,res) => {

    let input = req.body;
    console.log(input);

    let data = {
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message ? input.message : ''
    };

    connection.query('INSERT INTO  clients SET ?',[data], function(error, rows) {
        if(error) throw new  Error(error);
        res.send('Спасибо скоро мы с Вами свяжемся!');
    });
});


app.get('/news/:from/:lim', (req,res) => {
    connection.query(`SELECT  * FROM news LIMIT ${req.params.from}, ${req.params.lim}`, function(error, rows) {
        if(error) throw new  Error(error);
        res.json(rows);
    });
});


app.get('/news', (req,res) => {
    connection.query(`SELECT COUNT(*) FROM news `, function(error, rows) {
        if(error) throw new  Error(error);
        res.json(rows);
    });
});

app.get('/test', (req,res) => {
    connection.query(`SELECT COUNT(*) FROM news `, function(error, rows) {
        if(error) throw new  Error(error);
        res.json(rows);
    });
});

//404
app.use(function(req, res, next){
    res.status(404).send('Нет такой страницы повторите ввод!');
});

app.listen(PORT, function(){
    console.log(`Прослушиваем порт по адрессу ${PORT}`);
    });

