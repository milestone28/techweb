#installation for server dependency
#part 1
1. [ ] npm i express
2. [ ] npm i nodemon -D "D for development Dependency only"

#part 2
1. [ ] npm i date-fns uuid 
2. [ ] ookie-parser //3rd part middleware
3. [ ] cors // to resolve cors problem

#part 3 
1. [ ] npm i dotenv //this will store your url 
2. [ ] npm i mongoose //this will install the database or the mongoDB
3. [ ] npm i mongoose-sequence // this will add the sequnce that start 5000 or 1000 default or autoIncreament

#part 1 - creating structure
0. [ ] create gitignore file
1. [ ] set package json "scripts": { "start": "node server", "dev": "nodemone server" }
2. [ ] create server.js
3. [ ] create routes folder and root.js
4. [ ] create views folder and .html
5. [ ] create public folder and style.css

#part - 2 Middleware
1. [ ] create logs folder
2. [ ] create middleware folder
3. [ ] create a file inside the middleware name it logger.js
4. [ ] create a file inside the middleware name it errorHandler.js
5. [ ] create folder config
6. [ ] under the config folder create file allowedOrigins this will a config to allow url's
7. [ ] under the config folder create a file corsOptions.js

#part - 3 MonggoDB
1. [ ] create a file .env
2. [ ] create folder models
3. [ ] create file models Note and User.js
4. [ ] create file under the config folder dbConn.js
5. [ ] connect the dbConn modules and mongoose in the server.js 