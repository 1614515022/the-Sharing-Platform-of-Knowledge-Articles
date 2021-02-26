import {axiosGet,axiosPost,axiosDelete,axiosPatch} from '../libs/http'

let baseURL = 'http://localhost:3000';

function userLogin(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/user/login',
            data:options.data,
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}

function userCreate(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/users',
            data:options.data,
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}


function getUser(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/getUser',
            data:options.data,
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}

function userUpdate(options){
    new Promise((resolve,reject)=>{
        axiosPost({
            url:baseURL+'/api/userUpdate',
            data:options.data,
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}

function upload(options){
    return new Promise((resolve, reject)=>{
        axiosPost({
            url:baseURL+`/api/upload`,
            data:options,
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}

export{
    userLogin,upload,userCreate,userUpdate,getUser
}