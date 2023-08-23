require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser'); //3rd party middleware
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;

connectDB();

console.log(process.env.NODE_ENV);

app.use(logger); //should be 1st of the use
app.use(cors(corsOptions)); //this use for the cors

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message : '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found.');
    }
});



app.use(errorHandler); //should be use last

//add listener when connected
mongoose.connection.once('open',() => {
    console.log('Connected to DB.');
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
})

//add listener if it has and error
mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.ok} : ${err.code}\t${err.codeName}\t${err.hostname}`,'mongoErrLog.log');
})