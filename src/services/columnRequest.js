import {axiosGet,axiosPost,axiosDelete,axiosPatch} from '../libs/http'

let baseURL = 'http://localhost:3000';


function getColumn(){
    return new Promise((resolve, reject) => {
        axiosGet({
            url:baseURL+'/api/column',
            success:(data)=>{
                resolve(data)
            },
            error:(err)=>{
                reject(err)
            }
        })
    })
}

function getoColumn(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/oColumn',
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

function getMyColumn(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/myColumn',
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

function updateCol(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/columnUpdate',
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

function searchAll(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/searchAll',
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

function createColumn(options){
    return new Promise((resolve, reject) => {
        axiosPost({
            url:baseURL+'/api/createColumn',
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
    getColumn,
    getoColumn,
    getMyColumn,
    updateCol,
    searchAll,
    createColumn
}