const express = require('express');
const bodyParser = require('body-parser');
const user = require('./router/user.js');
const article = require('./router/article.js');
const column = require('./router/column.js');
const comment = require('./router/comment.js');

let app = express();
app.use('/public/', express.static('./src/express/public/'))


app.use(bodyParser.urlencoded({extended : false}))

app.use(user,article,column,comment)

app.listen(3000,()=>{
    console.log('http://localhost:3000');
})
