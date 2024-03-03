**I. Project introduction**
The website is used to read news and make todo list.
Frontend: React, Bootstrap, link: https://github.com/TuyetAnh82198/news-app-frontend
Backend: NodeJS, Express, Socket.IO, link: https://github.com/TuyetAnh82198/news-app-backend
Database: MongoDB
Performance optimization: useCallback, Compression
Language: English

**II. Functional description**
_Website functions are only available to logged in users._

Create account, create random pass, confirm pass, personalize with greeting, pagination and favorite category settings,
input value validation, search for news;
Todolist: add (there is reset button for input value )/mark/undo mark/delete (confirm first) tasks

**III. Demo link**
https://news-app-frontend-6ibw.onrender.com
*Recommended browser: Firefox

**IV. Deployment guide (on local)**

1. We need to install NodeJS 

2. Frontend:
npm start (localhost 3000)
.env: REACT_APP_BACKEND, REACT_APP_FRONTEND

3. Backend:
npm start (localhost 5000)
nodemon.json:
{
  "env": {
    "CLIENT": "for example http://localhost:3000",
    "MONGO_USER": "",
    "MONGO_PASS": ""
  }
}
And then update scripts in package.json, for example:
"start": "NODE_ENV=development CLIENT=http://localhost:3000 MONGODB_USER=abc MONGODB_PASS=xyz nodemon app.js"

_We can use newsapi with my api key which is commented for more data._

**Login information:**
email: abc@gmail.com
pass: 12345678
