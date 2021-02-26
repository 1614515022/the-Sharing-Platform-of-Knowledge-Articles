<template>
  <div id='oColumn'>
      <NavBar/>
      <div class='action' v-show='isAction'>
        <h4>是否确定删除该文章</h4>
        <div class='chooseOpt'>
            <a @click='defineAction'>确定</a>
            <a @click='cancelAction'>取消</a>  
        </div>
      </div>
      <div class='action' v-show='isLogin'>
        <h4>您还未登陆，是否跳转至登录页面</h4>
        <div class='chooseOpt'>
            <a @click='loginAction'>确定</a>
            <a @click='cancelAction'>取消</a>  
        </div>
      </div>
      <div class='oColumnBox'>
          <div class='oColumnCard' v-for='(item,index) in oColumn' :key='index'>
                <img :src='item.img' />

                <div class='cardName'>
                    <h2>{{item.title}}</h2>
                    <p>{{item.colDes}}</p>
                </div>
          </div>
          <div class='oColumnContent'>
                <div class='contentCard' v-for='(item,index) in articleList' :key='index'>
                        <h2 @click='toArticle(item.id)'>{{item.title}}</h2>
                        <img :src='item.img'/>
                        <p>{{item.content}}</p>
                        <span>{{item.time}}</span>
                        <ul class='baseActions' v-article-action='{
                            articleId:item.id,
                            isLogin:isLogin
                        }'>
                           <li><a>赞同</a></li> 
                           <li @click='openComment(item.id)'><a>评论</a></li> 
                           <li><a>收藏</a></li> 
                        </ul>
                        <ul class='ownActions' v-show='isOwnActions'>
                            <li><a @click='editAction(item.id)'>编辑</a></li>
                            <li><a @click='deleteAction(item.id)'>删除</a></li>
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
                                    <a @click='responsePublish(item.nikeName,item.articleId)'>回复</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='commentIpt' v-show='isCommentIpt(item.id)'>
                        <input type='text' v-model='commentIpt'  placeholder='请写下你的评论' />
                        <a @click='commentPublish(item.id)'>发布</a>
                    </div>    
                </div>
                
                <div class='loadMore' ref='hasMore'>
                    <a @click='loadMore' >加载更多</a>
                </div>
          </div>
      </div>
      
  </div>
</template>

<script>
import { getoColumn } from '../services/columnRequest';
import { getArticle,agreeListIpt,myAgreeList,deleteArticle } from '../services/articleRequest';
import { getComment,myCommentPublish,myResponsePublish } from '../services/commentRequest';
import { getUser } from '../services/userRequest';
import { onMounted,computed,reactive,toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { articleAction } from '@/directives';
import { getNowTime } from '@/libs/utils';
export default {
    name:'oColumn',
    directives:{
        articleAction,
    },
    setup(){
        let state = reactive({
            hasMore : '',
            commentIpt:'',
            responseIpt:'',
            isCommention: false,
            isCommentInput: false,
            isResponseInput: false,
            isOwnActions: false,
            isAction: false,
            isLogin: false,
        })
        const store = useStore(),
              router = useRouter();

        let toArticle = (id) =>{
            router.push(`/article/${id}`)
        }
        
        let openComment = async(id) =>{
            let token = localStorage.getItem('myToken');
            if(token == ''){
                state.isLogin = true;
            }else{
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
                //console.log(commentList)
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

        let responsePublish = async(parentTitle,articleId) =>{
            let userId = localStorage.getItem('userId');
            let res = await getUser({
                data:{
                    id:userId
                }
            })
            let userMsg = res.data.data[0]
            setTimeout(async()=>{
                state.isResponseInput = false;
                let result = await getComment({
                    data:{
                        articleId:articleId
                    }
                })
                let commentList = result.data.data;
                store.commit('getCommentList',commentList);
                state.responseIpt = '';
            })
            await myResponsePublish({
                data:{
                    nikeName:userMsg.nikeName,
                    img:userMsg.img,
                    commention:state.responseIpt,
                    time:getNowTime(),
                    articleId:articleId,
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

        let loadMore = async(e) =>{
            let id = router.currentRoute.value.params.id;
            let res = await getArticle({
                data:{
                    id
                }
            })
            let articleList = res.data.data;
            let resArr = [];
            for(let i=0;i<articleList.length;i=i+5){
                resArr.push(articleList.slice(i,i+5));
            }
            let length = store.state.articleList.length
            if(articleList.length - length >= 6){
                resArr[length/5].forEach((item)=>{
                store.commit('pushArticleList',item);
                })
            }else{
                for(let i=length;i<articleList.length;i++){
                    if(articleList[i].id != store.state.articleList.id){
                        store.commit('pushArticleList',articleList[i])
                    }
                }
            }
            //store.commit('pushColumnList',resArr[length/6])
            if(articleList.length - length <= 5){
                e.target.parentNode.style.display = 'none';
            }
        }

        let deleteAction = (id) =>{
            store.commit('getDeleteList',id)
            state.isAction = true
        } 

        let cancelAction = () =>{
            state.isAction = false;
            state.isLogin = false;
        }

        let defineAction = async() =>{
            setTimeout(async()=>{
                state.isAction = false;
                let id = router.currentRoute.value.params.id;
                let result = await getArticle({
                    data:{
                        id
                    }
                })
                let articleList = result.data.data;
                let resArr = [];
                for(let i=0;i<articleList.length;i=i+5){
                    resArr.push(articleList.slice(i,i+5))
                }
                store.commit('getArticle',resArr[0]);  
            },200)
            let articleId = store.state.deleteList;
            let res = await deleteArticle({
                data:{
                    articleId:articleId
                }
            })    
        }

        let editAction = (id) =>{
            router.push(`/editArticle/${id}`);
        }

        let loginAction = () =>{
            router.push('/login');
        }

        onMounted(async()=>{
            let userId = localStorage.getItem('userId');
            let id = router.currentRoute.value.params.id
            let res = await getoColumn({
                data:{
                    id
                }
            });
            let oColumnMsg = res.data.data
            store.commit('getoColumn',oColumnMsg);
            if(oColumnMsg[0].userId == userId){
                state.isOwnActions = true
            }

            let result = await getArticle({
                data:{
                    id
                }
            })
            let articleList = result.data.data
            let resArr = []
            for(let i=0;i<articleList.length;i=i+5){
                resArr.push(articleList.slice(i,i+5))
            }
            store.commit('getArticle',resArr[0]);
            if(store.state.articleList.length < 4){
                state.hasMore.style.display = 'none';
            }
            let agreeList = await myAgreeList()
        })

        return{
            toArticle,
            loadMore,
            ...toRefs(state),
            openComment,
            isComment,
            commentPublish,
            isCommentIpt,
            deleteAction,
            cancelAction,
            defineAction,
            editAction,
            loginAction,
            openResponse,
            isResponseIpt,
            responsePublish,
            oColumn:computed(()=>store.state.oColumn),
            articleList:computed(()=>store.state.articleList),
            commentList:computed(()=>store.state.commentList),
        }
    }
}

</script>
<style lang='scss' scoped>
#oColumn{
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
            color:red;  
        }
        .chooseOpt{
            text-align: center;
            a{
                cursor: pointer;
                color:white;
                text-align:center;
                
            }
            a:nth-child(1){
                margin-right:300px;
            }
        }
    }
    .oColumnBox{
        box-sizing: border-box;
        width:55%;
        margin:20px auto;
        .oColumnCard{
            display:flex;
            align-items: center;
            padding-bottom:50px;
            border-bottom:1px solid #ccc;
            img{
                border:1px solid #ccc;
                width:20%;
                border-radius: 163px;
            }
            .cardName{
                width:70%;
                margin-left:20px;
                h2{
                    margin-bottom: 10px;
                }
            } 
        }
        .oColumnContent{
            margin-top:50px;
            .contentCard{
                border:1px solid #ccc;
                box-sizing: border-box;
                padding:10px;
                margin-bottom: 20px;
                align-items: center;
                h2{
                    margin-bottom: 20px;
                }
                h2:hover{
                    color:#0d6efd;
                    cursor: pointer;
                }
                
                img{
                    width:200px;
                    height:100px;
                    border-radius: 10px;
                    margin-right:10px;
                }
                p{
                    display: inline-block;
                    width:70%;
                    height:106px;
                    overflow: hidden;
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
                .ownActions{
                    margin-left: 50px;
                    list-style: none;
                    display:inline-block;
                    li{
                        float: left;
                    }
                    li:nth-child(1){
                        cursor: pointer;
                        background-color: lightgreen;
                        color: white;
                        padding:5px 10px;
                        margin-right: 30px;
                    }
                    li:nth-child(2){
                        cursor: pointer;
                        background-color: red;
                        color: white;
                        padding:5px 10px;
                        margin-right: 30px;
                    }
                }
                span{
                    display: inline-block;
                    margin-top:20px;
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
            .loadMore{
                width:100px;
                margin: 10px auto;
                transform:translate(-10px,0);
                border:1px solid #0d6efd;
                color: #0d6efd;
                padding:10px 50px;
                text-align: center;
                cursor: pointer;
                
            }
            .loadMore:hover{
                color:white;
                background-color: #0d63fd;
            }
        }
    }
}
</style>