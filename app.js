const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');

const watchesRoutes = require('./api/routes/watches');
const commentsRoutes = require('./api/routes/comments');
const usersRoutes = require('./api/routes/users');
const ordersRoutes = require('./api/routes/orders');

const username = 'Mario';
const password = 'pl3v3n';

cloudinary.config({
    cloud_name: 'dr8ovbzd2',
    api_key: '562999287916593',
    api_secret: 'B7oPT9o7Dk0W2E1fOe3e7PS2ZIY'
});

mongoose
    .connect('mongodb://' + username + ':' + password + '@kayzer-shard-00-00-mjnzd.mongodb.net:27017,kayzer-shard-00-01-mjnzd.mongodb.net:27017,kayzer-shard-00-02-mjnzd.mongodb.net:27017/kayzer?ssl=true&replicaSet=Kayzer-shard-0&authSource=admin&retryWrites=true',
        {
            useNewUrlParser: true
        })
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
        res.status(200).json({});
    }

    next();
});

app.use('/watches', watchesRoutes);
app.use('/users', usersRoutes);
app.use('/orders', ordersRoutes);
app.use('/watches', commentsRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res) => {
    res.status(error.status);
    res.json({
        error: error.message
    });
})

module.exports = app;