<template>
  <div>
        <NavBar/>
        <div class='myCollectList'>
            <div class='oColumnContent'>
                <div class='contentCard' v-for='(item,index) in myCollectList' :key='index'>
                    <h2 @click='toArticle(item.id)'>{{item.title}}</h2>
                    <img :src='item.img'/>
                    <p>{{item.content}}</p>
                    <span>{{item.time}}</span>
                    <ul v-article-action='{
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
                
            </div>
        </div>
  </div>
</template>

<script>
import { articleAction } from '@/directives'
import { onMounted,computed,reactive,toRefs } from 'vue';
import { useStore } from 'vuex';
import { getComment,myCommentPublish,myResponsePublish } from '../services/commentRequest';
import { getUser } from '../services/userRequest';
import { useRouter } from 'vue-router'
import { myCollectList,getoArticle } from '@/services/articleRequest';
import { getNowTime } from '@/libs/utils';
export default {
    name:'myCollect',
    directives:{
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
        let store = useStore(),
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
        onMounted(async()=>{
            let userId = localStorage.getItem('userId');
            let res = await myCollectList()
            for(let i=0;i<res.data.length;i++){
                let id = res.data[i].id;
                let collectList = res.data[i].collectList
                if(collectList != null){
                    let comma = parseInt(collectList.length/2)
                    let index = ''
                    if(collectList.indexOf(userId) != 0 ){
                        index = collectList.indexOf(userId)-comma
                    }else{
                        index = collectList.indexOf(userId)
                    }
                    if(index != -1-comma){
                        let res = await getoArticle({
                            data:{
                                id:id
                            }
                        })
                        store.commit('pushMyCollectList',res.data.data[0])
                    }
                }
            }
        })
        return{
            ...toRefs(state),
            toArticle,
            myCollectList:computed(()=>store.state.myCollectList),
            openComment,
            isComment,
            commentPublish,
            isCommentIpt,
            openResponse,
            isResponseIpt,
            responsePublish,
            commentList:computed(()=>store.state.commentList),
        }
    }
}

</script>
<style lang='scss' scoped>
.myCollectList{
    box-sizing: border-box;
    width:55%;
    margin:20px auto;
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
            ul{
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
                }
                li:nth-child(3){
                    cursor: pointer;    
                    padding:5px 10px;
                    background-color: rgba(0,102,255,.1);
                    color: #0d6efd;
                    color:#999;
                }
            }
            span{
                display: inline-block;
                margin-top:20px;
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
</style>