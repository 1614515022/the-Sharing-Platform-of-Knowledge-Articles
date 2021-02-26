<template>
  <div id='article'>
      <NavBar/>
      <div class='articleBox' v-for='(item,index) in oArticle' :key='index'>
          <div class='navBar'>
              <ul>
                  <li><a href='/'>首页</a></li>
                  <li><a @click='toColumn'>专栏首页</a></li>
                  <li>{{item.title}}</li>
              </ul>
          </div>
          <img :src='item.img' />
          <h1>{{item.title}}</h1>
          <div class='aCard'>
              <div class='mainCard'>
                    <img :src='item.aImg' />
                    <div class='cardContent'>
                        <h4>{{item.aName}}</h4>
                        <p>{{item.aDescribe}}</p>
                    </div>
              </div>
              
              <i>发表于:{{item.time}}</i>
          </div>
          <div class='aContent'>
              <pre>{{item.content}}</pre>
          </div>
          <ul class='baseActions' v-article-action='{
                articleId:item.id
            }'>
            <li><a>赞同</a></li> 
            <li @click='openComment(item.id)'><a>评论</a></li> 
            <li><a>收藏</a></li> 
          </ul>
          <div class='commentBox' v-if='isComment(item.id)'>
                <div class='commentTop'>
                    <span>评论</span>
                </div>
                <div class='commentBody'>
                    <div class='oComment' v-for='(item,index) in commentList' :key='index'>
                        <div class='Commentator'>
                            <img :src='item.img'/>
                            <span class='nkName'>{{item.nikeName}}</span>
                            <span v-show='item.parentTitle != null' class='oResponse'>
                                <p>回复</p>
                                <p>{{item.parentTitle}}</p>
                            </span>
                            <span class='pubTime'>{{item.time}}</span>
                        </div>
                        <p>{{item.commention}}</p>
                        <a @click='openResponse(item.id)'>回复</a>
                        <div class='responseIpt' v-show='isResponseIpt(item.id)'>
                            <input type='text' v-model='responseIpt'  placeholder='请写下你的回复' />
                            <a @click='responsePublish(item.nikeName)'>回复</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class='commentIpt' v-show='isCommentIpt(item.id)'>
                <input type='text' v-model='commentIpt'  placeholder='请写下你的评论' />
                <a @click='commentPublish(item.id)'>发布</a>
            </div> 
      </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { getoArticle } from '../services/articleRequest';
import { getComment,myCommentPublish,myResponsePublish } from '../services/commentRequest';
import { getUser } from '../services/userRequest';
import { useStore } from 'vuex';
import { computed,onMounted,reactive,toRefs } from 'vue';
import { articleAction } from '@/directives';
import { getNowTime } from '@/libs/utils';
export default {
    name:'Article',
    directives: {
        articleAction
    },
    setup(){
        let state = reactive({
            commentIpt:'',
            responseIpt:'',
            isCommention: false,
            isCommentInput: false,
            isResponseInput: false,
        })
        const router = useRouter(),
              store = useStore();
        let toColumn = () =>{
            let oColumnId = store.state.oArticle[0].oColumnId
            router.push(`/oColumn/${oColumnId}`)
        }
        let openComment = async(id) =>{
            state.commentIpt = ''
            let event = window.event
            if(state.isCommention == true){
                event.target.innerHTML = '评论'
                state.isCommention = false
            }else{
                event.target.innerHTML = '收起'
                state.isCommention = true
            }

            if(state.isCommentInput == true){
                state.isCommentInput = false
            }else{
                state.isCommentInput = true
            }
            store.commit('getCommentIpt',id)
            let res = await getComment({
                data:{
                    articleId:id
                }
            })
            let commentList = res.data.data
            store.commit('getCommentList',commentList)
        }

        let openResponse = async(id) =>{
            state.responseIpt = ''
            let event = window.event

            if(state.isResponseInput == true){
                state.isResponseInput = false
                event.target.innerHTML = '回复'
            }else{
                state.isResponseInput = true
                event.target.innerHTML = '收起'
            }
            store.commit('getResponseIpt',id)
        }
        
        let isComment = (id) =>{ 
            if(state.isCommention == true){
                if(store.state.commentList[0]){
                    let articleId = store.state.commentList[0].articleId
                    
                    if(articleId == id){
                        return true
                    }else{
                        return false
                    } 
                }  
            }else{
                return false
            }
             
        }

        let isResponseIpt = (id) =>{
            if(localStorage.getItem('myToken').length != 0 ){
                if(state.isResponseInput == true){
                    if(id == store.state.responseIpt){
                        return true
                    }  
                }else{
                    return false
                }
            }
        } 

        let commentPublish = async(id) => {
            let userId = localStorage.getItem('userId')
            let res = await getUser({
                data:{
                    id:userId
                }
            })
            let userMsg = res.data.data[0]
            setTimeout(async()=>{
                let result = await getComment({
                    data:{
                        articleId:id
                    }
                })
                let commentList = result.data.data
                store.commit('getCommentList',commentList)
                state.commentIpt = ''
            })
            await myCommentPublish({
                data:{
                    nikeName:userMsg.nikeName,
                    img:userMsg.img,
                    commention:state.commentIpt,
                    time:getNowTime(),
                    articleId:id
                }
            })
            
        }

        let responsePublish = async(parentTitle) =>{
            let userId = localStorage.getItem('userId')
            let id = store.state.commentList[0].id
            let res = await getUser({
                data:{
                    id:userId
                }
            })
            let userMsg = res.data.data[0]
            setTimeout(async()=>{
                state.isResponseInput = false
                let result = await getComment({
                    data:{
                        articleId:id
                    }
                })
                let commentList = result.data.data
                store.commit('getCommentList',commentList)
                state.responseIpt = ''
            })
            await myResponsePublish({
                data:{
                    nikeName:userMsg.nikeName,
                    img:userMsg.img,
                    commention:state.responseIpt,
                    time:getNowTime(),
                    articleId:id,
                    parentTitle:parentTitle
                }
            })
        }

        let isCommentIpt = (id) =>{
            if(localStorage.getItem('myToken').length != 0 ){
                if(state.isCommentInput == true){
                    if(id == store.state.commentIpt){
                        return true
                    }  
                }else{
                    return false
                }
            }
        }
        onMounted(async()=>{
            let id = router.currentRoute.value.params.id
            let res = await getoArticle({
                data:{
                    id
                }
            })
            store.commit('getoArticle',res.data.data)
        })

        return{
            toColumn,
            openComment,
            isComment,
            commentPublish,
            isCommentIpt,
            ...toRefs(state),
            openResponse,
            isResponseIpt,
            responsePublish,
            oColumn:computed(()=>store.state.oColumn),
            commentList:computed(()=>store.state.commentList),
            oArticle:computed(()=>store.state.oArticle)
        }
    }
}

</script>
<style lang='scss' scoped>
.articleBox{
    box-sizing: border-box;
    width:55%;
    margin:20px auto;
    .navBar{
        box-sizing: border-box;
        ul{
            color:#6c757d;
            display: flex;
            flex-wrap: wrap;
            padding:10px;
            border-radius: 1px solid #e9ecef;
            background-color: #e9ecef;
            list-style:none;
            li:nth-child(2):before{
                padding: 0 10px;
                content:('/')
            }
            li:nth-child(3):before{
                padding: 0 10px;
                content:('/')
            }
            li{ 
                a{
                    cursor: pointer;
                    text-decoration: none;
                    color: #0d6efd;  
                }
            } 
        }
    }
    img{
        width:100%;
        height: 370px;
    }   
    h1{
        padding:20px 0;
    }
    .aCard{
        display:flex;
        padding:20px 0;
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;
        .mainCard{
            display: flex;
            align-items: center;
            img{
                width:50px;
                height: 50px;
                border-radius:50px;
            }
            .cardContent{
                margin-left:10px;
            }
        }
        i{
            flex:1;
            text-align: right;
            padding:10px;
        }
    }
    .aContent{
        margin-top:50px;
        margin-bottom:30px;
        width:100%;
        pre{
            font-size:16px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    }
    .baseActions{
        list-style: none;
        display:inline-block;
        li{
            float: left;
        }
        li:nth-child(1){
            cursor: pointer;
            background-color: rgba(0,102,255,.1);
            color: #0d6efd;
            padding:5px 10px;
            margin-right: 30px;
        }
        li:nth-child(2){
            cursor: pointer;
            padding:5px 10px;
            color:#999;
            margin-right: 15px;
            text-align: center;
        }
        li:nth-child(3){    
            cursor: pointer;    
            padding:5px 10px;
            background-color: rgba(0,102,255,.1);
            color: #0d6efd;
            color:#999;
        }
    }
    .commentBox{
        width:100%;
        box-sizing: border-box;
        .commentTop{
            padding:10px;
            border-bottom:1px solid #ccc;
        }
        .commentBody{
            margin-top:20px;
            .oComment{
                padding:10px;
                border-bottom: 1px solid #ccc;
                .Commentator{
                    position: relative;
                    img{
                        width:24px;
                        height: 24px;
                    }
                    .oResponse{
                        p:nth-child(1){
                            color:#0d6efd;
                        }
                    }
                    .pubTime{
                        position:absolute;
                        right:10px;
                    }
                }
                p{
                    width:95%;
                    display:inline;
                    margin-left:30px;
                    margin-top:10px;
                }
                a{
                    display:block;
                    margin-left:30px;
                    color:#0d63fd;
                    cursor: pointer;
                }
                .responseIpt{
                    margin:20px;
                    input{
                        width:80%;
                        padding:10px 10px;
                        border:1px solid #ccc; 
                    }
                    a{
                        cursor: pointer;
                        display:inline;
                        margin-left:20px;
                        padding:10px 10px;
                        background-color: #0d6efd;
                        color: white;
                    }
                }
            }
        }
    }
    .commentIpt{
        margin:20px;
        input{
            width:80%;
            padding:10px 10px;
            border:1px solid #ccc; 
        }
        a{
            cursor: pointer;
            margin-left:20px;
            padding:10px 10px;
            background-color: #0d6efd;
            color: white;
        }
    }
}
</style>