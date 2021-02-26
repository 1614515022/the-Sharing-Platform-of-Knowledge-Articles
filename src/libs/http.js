import axios from 'axios';
import qs from 'qs';

function axiosGet(options) {
    axios(options.url)
        .then((res)=>{
            options.success(res.data)
        })
        .catch((err)=>{
            options.error(err)
        })
}

function axiosPost(options){
    axios({
        url:options.url,
        method:'post',
        header:{
            'Content-type':'application/x-www-form-urlencoded',
        },
        data:qs.stringify(options.data)
    })
    .then((res)=>{
        options.success(res)
    })
    .catch((err)=>{
        options.error(err)
    })
}

function axiosPatch(options){
    axios({
        url:options.url,
        method:'patch'
    })
    .then((res)=>{
        options.success(res)
    })
    .catch((err)=>{
        options.error(err)
    })
}

function axiosDelete(options){
    axios({
        url:options.url,
        method:'delete'
    })
    .then((res)=>{
        options.success(res)
    })
    .catch((err)=>{
        options.error(err)
    })
}

export{
    axiosGet,axiosPost,axiosPatch,axiosDelete
}
