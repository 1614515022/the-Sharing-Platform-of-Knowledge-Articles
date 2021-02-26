<template>
  <div id='editArticle'>
        <NavBar/>
        <div class='action' v-show='isAction'>
            <h4 ref='tipText'></h4>
        </div>
        <div class='mainContent'>
            <h1>编辑文章</h1>
            <div class='imgFile'>
                <div class='imgEdit' @click='fileClick'>
                    <img :src='articleImg' />
                </div>
                <input type='file' @change='uploadMyFile'>
            </div>
            <form class='mainArticle'>
                <div class='articleTitle'>
                    <label for='titleIpt'>文章标题</label>
                    <input id='titleIpt' v-model='titleIpt' @blur='isNull' placeholder='请输入文章标题' />
                    <span class='titleText'>文章标题不能为空</span>
                </div>
                <div class='articleContent'>
                    <label for='contentIpt' @blur='isNull'>文章内容</label>
                    <textarea id='contentIpt' v-model='contentIpt' @blur='isNull' placeholder='请输入文章内容'/>
                    <span class='contentText'>文章内容不能为空</span>
                </div>
                <div class='submitIpt'>
                    <a @click='editArt'>编辑文章</a>
                </div>
            </form> 
        </div>
        
  </div>
</template>

<script>
import { editArticle,getoArticle } from '@/services/articleRequest';
import { onMounted,reactive,toRefs } from 'vue';
import { useRouter } from 'vue-router'; 
import $ from 'jquery';
import axios from 'axios';
export default {
    name:'editArticle',
    setup(){
        let state = reactive({
            titleIpt:'',
            contentIpt:'',
            articleImg:'',
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
            state.articleImg = res.data.data
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

        let editArt = async() =>{
            let articleId = router.currentRoute.value.params.id
            let res = await getoArticle({
                data:{
                    id: articleId,
                }
            })
            let article = res.data.data[0]
            let finalRes = await editArticle({
                data:{
                    title:state.titleIpt,
                    content:state.contentIpt,
                    img:state.articleImg,
                    articleId:articleId
                }
            })
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
                    router.push(`/oColumn/${article.oColumnId}`)
                },2000)
            }
        }

        onMounted(async()=>{
            let articleId = router.currentRoute.value.params.id
            let res = await getoArticle({
                data:{
                    id: articleId,
                }
            })
            let article = res.data.data[0]
            state.articleImg = article.img
            state.titleIpt = article.title
            state.contentIpt = article.content
        })

        return{
            ...toRefs(state),
            isNull,
            fileClick,
            uploadMyFile,
            editArt
        }
    }
}

</script>
<style lang='scss' scoped>
#editArticle{
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
            
            .articleTitle{
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
            .articleContent{
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