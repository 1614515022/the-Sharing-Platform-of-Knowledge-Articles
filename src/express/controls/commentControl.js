const doMysql = require('../libs/doMysql');


let getComment = async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let sql = 'select * from comment where articleId = ?';   
    let result = await doMysql(sql,[articleId]);
    if(result.data.length > 0){
        res.send({
            code:200,
            data:result.data,
        })
    }
}

let commentPublish = async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let nikeName = req.body.nikeName
    let img = req.body.img
    let commention = req.body.commention
    let time = req.body.time
    let sql = 'insert into comment(nikeName,img,commention,time,articleId) value(?,?,?,?,?)';   
    let result = await doMysql(sql,[nikeName,img,commention,time,articleId]);
}

let responsePublish = async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let nikeName = req.body.nikeName
    let img = req.body.img
    let commention = req.body.commention
    let time = req.body.time
    let parentTitle = req.body.parentTitle
    //console.log(nikeName,img,commention,time,articleId,parentTitle)
    let sql = 'insert into comment(nikeName,img,commention,time,articleId,parentTitle) value(?,?,?,?,?,?)';   
    let result = await doMysql(sql,[nikeName,img,commention,time,articleId,parentTitle]);
}

let updateComment = async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let nikeName = req.body.nikeName
    let newName = req.body.newName
    console.log(nikeName,newName)
    let sql = 'update comment set nikeName=? where nikeName=?';   
    let result = await doMysql(sql,[newName,nikeName]);
}

module.exports = {
    getComment,
    commentPublish,
    responsePublish,
    updateComment
}