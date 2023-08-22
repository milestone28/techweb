const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){ //!origin allow postman to access the -1 only limited to the array allowedOrigins
            callback(null, true); // null stand for no error and true for boolean
        }else {
            callback(new Error('Not allowed by CORS')); //if there is an error
        }
    },
    credentials: true, //set access credentials header
    optionsSuccessStatus: 200 //set it to 200 globaly devices the default is 204 but there's a lot problem for 204 devices nowadays.
}

module.exports = corsOptions;