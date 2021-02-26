import {axiosGet,axiosPost} from '../libs/http'

let baseURL = 'http://localhost:3000';


function getComment(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/getComment',
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

function myCommentPublish(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/commentPublish',
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

function myResponsePublish(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/responsePublish',
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

function updateComment(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/updateComment',
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

export{
    getComment,
    myCommentPublish,
    myResponsePublish,
    updateComment
}