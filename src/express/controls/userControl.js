const doMysql = require('../libs/doMysql');
const jwt = require('jsonwebtoken');
const fs = require('fs')
let userLogin = async (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    res.setHeader('Access-Control-Allow-Origin', '*')
    let sql = "select * from user where email = ? && password = ?"
    let result = await doMysql(sql,[email,password])
    let payload = {email};
    let secret = 'MyZhiHu';
    let token = jwt.sign(payload,secret);
    if(email != '' && password != '') {
        let reg = new RegExp('(?:[0-9a-zA-Z_]+.)+@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}');
        if(!email.match(reg)){
            res.send({
                code:400,
                msg:'输入的邮箱地址不符合规格'
            })
        }else if(password.length<6){
            res.send({
                code:400,
                msg:'输入的密码长度不能小于6'
            })
        }else if(result.data.length == 0){
            res.send({
                msg:'邮箱地址或密码输入不正确',
                code:400
            })
        }else{
            let sql = 'select id from user where email = ?'
            let id = await doMysql(sql,[email])
            let data = id.data[0]
            res.send({
                msg:'登录成功,2秒后跳转至主界面',
                code:200,
                data:{token,data}
            })
        } 
    }else{
        res.send({
            code:400,
            msg:'输入框内容都不能为空'
        })
    }
    
}

let userCreate = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let email = req.body.email
    let password = req.body.password
    let nikeName = req.body.nikeName
    let rePassword = req.body.rePassword
    let sql = 'select * from user where email = ?'
    let result = await doMysql(sql,[email])
    console.log(password,rePassword)
    if(email != '' && password != '' && nikeName != '' && rePassword != '') {
        let reg = new RegExp('(?:[0-9a-zA-Z_]+.)+@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}');
        if(!email.match(reg)){
            res.send({
                code:400,
                msg:'输入的邮箱地址不符合规格'
            })
        }else if(result.data.length != 0){
            res.send({
                code:400,
                msg:'该邮箱已经被注册过了'
            })
        }else if(password.length<6){
            res.send({
                code:400,
                msg:'输入的密码长度不能小于6'
            })
        }else if(password !== rePassword){
            res.send({
                code:400,
                msg:'两次密码输入不一致'
            })
        }
        else{
            let sql = 'insert into user (email,nikeName,password) value(?,?,?)'
            await doMysql(sql,[email,nikeName,password])
            res.send({
                code:200,
                msg:'注册成功'
            })
        } 
    }else{
        res.send({
            code:400,
            msg:'输入框内容都不能为空'
        })
    }
    
}

let getUser = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let id = req.body.id;
    let sql = 'select * from user where id = ?';
    let result = await doMysql(sql,[id])
    res.send(result)
}

let userUpdate = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    //console.log(req.body)
    let nikeName = req.body.nikeName;
    let describe = req.body.describe;
    let img = req.body.img;
    let userId = req.body.userId;
    let sql = `update user set nikeName=? , img=? , des=? where id=? `;
    let result = await doMysql(sql,[nikeName,img,describe,userId]);
    if(result.data.length == 0){
        res.send({
            code:400
        })   
    }else{
        res.send({
            code:200,
            msg:'用户信息更改成功'
        })
    }
    
}

module.exports = {
    userLogin,userCreate,getUser,userUpdate
}

