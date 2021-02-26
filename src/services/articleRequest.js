import {axiosGet,axiosPost,axiosDelete,axiosPatch} from '../libs/http'

let baseURL = 'http://localhost:3000';


function getArticle(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/article',
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

function getoArticle(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/oArticle',
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

function createArticle(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/createArticle',
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

function agreeListIpt(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/agreeListIpt',
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

function getAgreeList(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/getAgreeList',
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

function getCollectList(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/getCollectList',
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

function collectListIpt(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/collectListIpt',
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

function myCollectList(){
    return new Promise((resolve, reject) => {
        axiosGet({
            url:baseURL+'/api/myCollectList',
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}

function deleteArticle(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/deleteArticle',
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

function editArticle(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/editArticle',
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

function articleArt(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/articleArt',
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