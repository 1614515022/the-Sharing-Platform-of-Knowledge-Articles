const mysql = require('mysql');

let pool =  mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'zhihu',
})

function doMysql (sql,params=[]) {
    return new Promise(function (resolve,reject) {
        pool.getConnection(function(error,connection){
            if(error){
                reject(error)
            }else{
                connection.query(sql,params,function(err,data){
                    connection.release()
                    resolve({err,data})
                })
            }
        })
    })
}

module.exports = doMysql;