<template>
  <div id='createColumn'>
        <NavBar/>
        <div class='action' v-show='isAction'>
            <h4 ref='tipText'></h4>
        </div>
        <div class='mainContent'>
            <h1>新建专栏</h1>
            <div class='imgFile'>
                <div class='imgEdit' @click='fileClick'>
                    <img :src='columnImg' />
                </div>
                <input type='file' @change='uploadMyFile'>
            </div>
            <form class='mainArticle'>
                <div class='columnTitle'>
                    <label for='titleIpt'>专栏标题</label>
                    <input id='titleIpt' v-model='titleIpt' @blur='isNull' placeholder='请输入专栏标题' />
                    <span class='titleText'>专栏标题不能为空</span>
                </div>
                <div class='columnDes'>
                    <label for='contentIpt' @blur='isNull'>专栏简介</label>
                    <textarea id='contentIpt' v-model='contentIpt' @blur='isNull' placeholder='请输入专栏简介'/>
                    <span class='contentText'>专栏简介不能为空</span>
                </div>
                <div class='submitIpt'>
                    <a @click='createCol'>新建专栏</a>
                </div>
            </form> 
        </div>
        
  </div>
</template>

<script>
import { createColumn,getMyColumn } from '@/services/columnRequest';
import { onMounted,reactive,toRefs } from 'vue';
import { useRouter } from 'vue-router'; 
import $ from 'jquery';
import axios from 'axios';
export default {
    name:'createColumn',
    setup(){
        let state = reactive({
            titleIpt:'',
            contentIpt:'',
            columnImg:'',
            isAction:false,
            tipText:'',
        })
        let router = useRouter();
        let uploadMyFile = async(e) =>{
            let file = e.target.files[0]
            let formData = new FormData();
            formData.append('file',file,file.name);
            formData.append('data',112)

            let res = await axios.post("http://localhost:3000/api/upload", formData, {
                headers: { "content-type": "multipart/form-data" }
            });
            state.columnImg = res.data.data
        }

        let isNull = (e) =>{
            if(e.target.tagName == 'INPUT'){
                if(state.titleIpt.length == 0){
                    $(e.target).siblings('.titleText')[0].style.display = 'block';
                }else{
                    $(e.target).siblings('.titleText')[0].style.display = 'none';
                }
            }
           if(e.target.tagName == 'TEXTAREA'){
            if(state.contentIpt.length == 0){
                $(e.target).siblings('.contentText')[0].style.display = 'block';
            }else{
                $(e.target).siblings('.contentText')[0].style.display = 'none';
            }
           }
        }
        let fileClick = (e) =>{
            e.target.parentNode.parentNode.lastChild.click()
        }

        let createCol = async() =>{
            console.log(1)
            let userId = localStorage.getItem('userId');
            let finalRes = await createColumn({
                data:{
                    title:state.titleIpt,
                    colDes:state.contentIpt,
                    img:state.columnImg,
                    userId:userId
                }
            })
            //console.log(2)
            let result = await getMyColumn({
                data:{
                    userId: userId
                }
            })

            let myColumn = result.data.data
            let colId = myColumn[0].id
            if(finalRes.data.code != 200){
                state.tipText.style.color = "red"
                state.tipText.innerHTML = finalRes.data.msg
                state.isAction = true
                setTimeout(()=>{
                    state.isAction = false 
                },2000)
            }else{
                state.tipText.innerHTML = finalRes.data.msg
                state.isAction = true
                setTimeout(()=>{
                    state.isAction = false
                    router.push(`/oColumn/${colId}`)
                },2000)
            }
        }

        return{
            ...toRefs(state),
            isNull,
            fileClick,
            uploadMyFile,
            createCol
        }
    }
}

</script>
<style lang='scss' scoped>
#createColumn{
    height: 1000px;
    .action{
        box-sizing: border-box;
        padding:20px 20px;
        border:1px solid lightblue;
        background-color: lightblue;
        width:50%;
        border-radius: 5px;
        position: fixed;
        top:0;
        left:25%;
        z-index:1;
        h4{
            text-align:center;
            color:white;
            
        }
    }
    .mainContent{
        width:80%;
        margin:0 auto;
        h1{
            margin-top:20px;
        }
        .imgFile{
            position: relative;
            box-sizing: border-box;
            margin:20px auto ;
            width:75%;
            .imgEdit{
                cursor: pointer;
                width:200px;
                height:200px;
                border:1px solid #ccc;
                border-radius: 200px;
                overflow: hidden;
                margin: 0 auto;
                img{
                    width:100%;
                    height: 100%;
                }
            }
            input{
                visibility: hidden;
                position: absolute;
                top:0;
                width:100%;
                height:100%;
            }
        }
        .mainArticle{
            box-sizing: border-box;
            margin-top:10px;
            
            .columnTitle{
                position: relative;;
                margin-bottom:30px;
                label{
                    display: block;
                    margin-bottom: 10px;
                }
                input{
                    width:100%;
                    padding:10px;
                    display:block;
                    font-size:16px;
                }
                .titleText{
                    display: none;
                    position: absolute;
                    color:red;
                }
            }
            .columnDes{
                position: relative;;
                label{
                    display: block;
                    margin-bottom: 10px;
                }
                textarea{
                    width:100%;
                    height: 250px;
                    padding:10px;
                    display:block;
                    font-size: 16px;
                }
                .contentText{
                    display: none;
                    position: absolute;
                    color:red;
                }
            }
            .submitIpt{
                margin-top:40px;
                cursor: pointer;
                a{
                    border:1px solid#0d6efd;
                    border-radius: 10px;
                    background-color: #0d6efd;
                    padding:10px;
                    color:white;
                }
            }
        }
    }
}
</style>