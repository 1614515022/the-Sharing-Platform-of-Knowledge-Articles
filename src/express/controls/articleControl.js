const doMysql = require('../libs/doMysql');

let getArticle = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = 'select * from article where oColumnId = ?'
    let result = await doMysql(sql,[req.body.id])
    res.send(result)
}

let getoArticle = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = 'select * from article where id = ?'
    let result = await doMysql(sql,[req.body.id])
    res.send(result)
}

let createArticle = async (req,res)=>{
    let title = req.body.title;
    let content = req.body.content;
    let img = req.body.img;
    let aName = req.body.aName;
    let aImg = req.body.aImg;
    let aDescribe = req.body.aDescribe;
    let time = req.body.time;
    let oColumnId = req.body.oColumnId;
    res.setHeader('Access-Control-Allow-Origin', '*')
    if(img.length == 0 || title.length == 0 || content.length == 0){
        res.send({
            code:400,
            msg:'文章图片、标题、内容都不能为空'
        })
    }else{
        let sql = 'insert into article(title,content,img,aName,aImg,aDescribe,time,oColumnId) value(?,?,?,?,?,?,?,?)'
        let result = await doMysql(sql,[title,content,img,aName,aImg,aDescribe,time,oColumnId])
        if(result.data.length == 0) {
            res.send({
                code:400
            })  
        }else{
            res.send({
                code:200,
                msg:'发布文章成功,2秒后跳转至个人专栏页'
            })
        }
    } 
    
}

let agreeListIpt = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let newAgreeList = req.body.newAgreeList
    let articleId = req.body.articleId
    let sql = 'update article set agreeList = ? where id = ?'
    let result = await doMysql(sql,[newAgreeList, articleId])
}

let getAgreeList = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let sql = 'select agreeList from article where id = ?'
    let result = await doMysql(sql,[articleId])
    if(result.data.length > 0){
        res.send({
            code:200,
            data:result.data[0]
        })
    }
}

let collectListIpt = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let newCollectList = req.body.newCollectList
    let articleId = req.body.articleId
    let sql = 'update article set collectList = ? where id = ?'
    let result = await doMysql(sql,[newCollectList, articleId])
}

let getCollectList = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let sql = 'select collectList from article where id = ?'
    let result = await doMysql(sql,[articleId])
    if(result.data.length > 0){
        res.send({
            code:200,
            data:result.data[0]
        })
    }
}

let myCollectList = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = 'select id,collectList from article'
    let result = await doMysql(sql,[])
    //console.log(result)
    if(result.data.length > 0){
        res.send({
            code:200,
            data:result.data
        })
    }
}

let deleteArticle = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let sql = 'delete from article where id = ?'
    let result = await doMysql(sql,[articleId])
}

let editArticle = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let articleId = req.body.articleId
    let title = req.body.title
    let content = req.body.content
    let img = req.body.img
    
    if(img.length == 0 || title.length == 0 || content.length == 0){
        res.send({
            code:400,
            msg:'文章图片、标题、内容都不能为空'
        })
    }else{
        let sql = 'update article set title=? , content=? , img=? where id=?'
        let result = await doMysql(sql,[title,content,img,articleId])
        if(result.data.length == 0) {
            res.send({
                code:400
            })  
        }else{
            res.send({
                code:200,
                msg:'编辑文章成功,2秒后跳转至个人专栏页'
            })
        }
    }
}

let articleArt = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let aName = req.body.aName
    let aDescribe = req.body.aDescribe
    let aImg = req.body.aImg
    let oColumnId = req.body.oColumnId
    let sql = 'update article set aName=? , aDescribe=? , aImg=? where oColumnId=?'
    let result = await doMysql(sql,[aName,aDescribe,aImg,oColumnId])
}

module.exports = {
    getArticle,
    getoArticle,
    createArticle,
    agreeListIpt,
    getAgreeList,
    getCollectList,
    collectListIpt,
    myCollectList,
    deleteArticle,
    editArticle,
    articleArt
}