const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'dd/MM/yyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) { //check if the folder is exist
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs')); //create if not exist
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem); //create file to save the logs
    } catch(err) {
        console.log(err);
    }
}

const logger = (req,res,next) => { //creating the middleware
    logEvents(`${req.method}\t${req.url}\t${req.header.origin}`, `reqLog.log`); //should be set to our own URL to prevent full storage
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = {logEvents, logger};