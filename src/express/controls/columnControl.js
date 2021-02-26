const doMysql = require('../libs/doMysql');


let getColumn = async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = 'select * from allColumn';   
    let result = await doMysql(sql);
    res.send(result);
}

let getoColumn = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = 'select * from allColumn where id = ?'
    let result = await doMysql(sql,[req.body.id])
    res.send(result)
}

let getMyColumn = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = 'select * from allColumn where userId = ?'
    //console.log(req.body.myToken)
    let result = await doMysql(sql,[req.body.userId])
    if(result.data.length == 0){
        res.send({
            code: 404,
            msg:'您还没有个人专栏,两秒后跳转至新建专栏页'
        })
    }else{
       res.send({
           code:200,
           data:result.data
       }) 
    }
    
}

let columnUpdate = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let title = req.body.title;
    let colDes = req.body.colDes;
    let img = req.body.img;
    let colId = req.body.colId;
    let sql = `update allColumn set title=? , img=? , colDes=? where id=? `;
    let result = await doMysql(sql,[title,img,colDes,colId]);
    console.log(result);
    if(result.data.length == 0){
        res.send({
            code:400
        })   
    }else{
        res.send({
            code:200,
            msg:'专栏信息更改成功'
        })
    }
    
}

let searchAll = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let searchIpt = req.body.searchIpt;
    let sql = 'select * from allColumn where title like \"%\"?\"%\"'
    let result = await doMysql(sql,[searchIpt])
    let sqlStr = 'select * from article where title like \"%\"?\"%\"'
    let oResult = await doMysql(sqlStr,[searchIpt])
    if(searchIpt.length > 0){
        if(result.data.length > 0 || oResult.data.length > 0){
            res.send({
                column:result.data,
                article:oResult.data,
                code:200
            })
        }else{
            res.send({
                code:400,
                msg:'没有搜素到拥有关键字内容'
            })
        }
    }else{
        res.send({
            code:400,
            msg:'没有输入搜素关键字'
        })
    }
}

let createColumn = async (req,res)=>{
    let title = req.body.title;
    let colDes = req.body.colDes;
    let img = req.body.img;
    let userId = req.body.userId;
    res.setHeader('Access-Control-Allow-Origin', '*')
    if(img.length == 0 || title.length == 0 || colDes.length == 0){
        res.send({
            code:400,
            msg:'专栏图片、标题、简介都不能为空'
        })
    }else{
        let sql = 'insert into allColumn(title,colDes,img,userId) value(?,?,?,?)'
        let result = await doMysql(sql,[title,colDes,img,userId])
        console.log(result)
        if(result.data.length == 0) {
            res.send({
                code:400
            })  
        }else{
            res.send({
                code:200,
                msg:'专栏新建成功,2秒后跳转至个人专栏页'
            })
        }
    } 
    
}

module.exports ={
    getColumn,
    getoColumn,
    getMyColumn,
    columnUpdate,
    searchAll,
    createColumn
}