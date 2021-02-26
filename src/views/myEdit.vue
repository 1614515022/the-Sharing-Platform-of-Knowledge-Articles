<template>
  <div id='myEdit'>
      <NavBar/>
      <div class='action' v-show='isAction'>
        <h4 ref='tipText'></h4>
      </div>
      <div class='editBox' v-if='isUserMsg' >
            <ul class='editOpt' @click='chooseOpt'>
                <li><a class='mainEdit active'>更新个人资料</a></li>
                <li><a class='mainEdit'>更新专栏信息</a></li>
            </ul>
            <h1>编辑个人资料</h1>
            <div class='imgFile'>
                <div class='imgEdit' @click='fileClick'>
                    <img :src='userImg'  />
                </div>
                <input type='file' id='file' name="file" @change='uploadMyFile' />
            </div>
            <form class='mainIpt'>
                <div class='nameIpt'>
                    <input v-model='userNk' name='userNk' @blur='isNull' placeholder="请输入昵称"/>
                    <span ref='userNkText'>昵称不能为空</span>
                </div>
                <div class='desIpt'>
                    <textarea v-model='userDes' name='userDes' @blur='isNull' placeholder="请输入简介信息"/>
                    <span ref='userDesText'>简介信息不能为空</span>
                </div>
                <div class='submitIpt'>
                    <a @click='userUd'>提交修改</a>
                </div>
            </form>
      </div>
      <div class='editBox' v-if='!isUserMsg' >
            <ul class='editOpt' @click='chooseOpt'>
                <li><a class='mainEdit'>更新个人资料</a></li>
                <li><a class='mainEdit active'>更新专栏信息</a></li>
            </ul>
            <h1>编辑个人专栏资料</h1>
            <div class='imgFile'>
                <div class='imgEdit' @click='fileClick'>
                    <img :src='colImg' />
                </div>
                <input type='file' name="file1" @change='uploadMyFile'>
            </div>
            <form class='mainIpt'>
                <div class='nameIpt'>
                    <input v-model='columnName' name='columnName' @blur='isNull' placeholder="请输入专栏名称"/>
                    <span ref='columnNameText'>昵称不能为空</span>
                </div>
                <div class='desIpt'>
                    <textarea v-model='columnDes' name='columnDes' @blur='isNull' placeholder="请输入专栏简介"/>
                    <span ref='columnDesText'>简介信息不能为空</span>
                </div>
                <div class='submitIpt'>
                    <a @click='colUpdate'>提交修改</a>
                </div>
            </form>
      </div>
  </div>
</template>

<script>
import { getSibiling } from '@/libs/utils';
import { getUser,userUpdate } from '@/services/userRequest';
import { getMyColumn,updateCol } from '@/services/columnRequest';
import { articleArt } from '@/services/articleRequest';
import { updateComment } from '@/services/commentRequest';
import { onMounted,computed,reactive,toRefs } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
export default {
    name:'myEdit',
    setup(){
        let state = reactive({
            userNk : '',
            userDes : '',
            userNkText : '',
            userDesText : '',
            columnName : '',
            columnDes : '',
            columnNameText: '',
            columnDesText : '',
            isUserMsg : true,
            userImg:'',
            colImg:'',
            tipText:'',
            isAction:false
        })
        let store = useStore();
        let chooseOpt = (e) =>{
            if(e.target.tagName === 'A'){
                if(e.target.className === 'mainEdit') {
                    e.target.className = 'mainEdit active';
                    getSibiling(e.target.parentNode)[0].firstChild.className = 'mainEdit';  
                }
                if(e.target.innerHTML === '更新个人资料'){
                    state.isUserMsg = true
                }else{
                    state.isUserMsg = false
                }
            }
        }

        let isNull = (e) =>{
            switch(e.target.name){
                case 'userNk':
                    //console.log(state.userNk.length)
                    if(state.userNk.length == 0){
                        state.userNkText.style.display = "block"
                    }else{
                        state.userNkText.style.display = "none"
                    }
                    break
                case 'userDes':
                    if(state.userDes.length == 0){
                        state.userDesText.style.display = "block"
                    }else{
                        state.userDesText.style.display = "none"
                    }
                    break
                case 'columnName':
                    if(state.columnName.length == 0){
                        state.columnNameText.style.display = "block"
                    }else{
                        state.columnNameText.style.display = "none"
                    }
                    break
                case 'columnDes':
                    if(state.columnDes.length == 0){
                        state.columnDesText.style.display = "block"
                    }else{
                        state.columnDesText.style.display = "none"
                    }
                    break
                default:
                    break
            }
            
        }

        let fileClick = (e) =>{
            e.target.parentNode.parentNode.lastChild.click()
        }

        let uploadMyFile = async(e) =>{
            let file = e.target.files[0]
            let formData = new FormData();
            formData.append('file',file,file.name);
            formData.append('data',112)

            let res = await axios.post("http://localhost:3000/api/upload", formData, {
                headers: { "content-type": "multipart/form-data" }
            });
            if(e.target.name == 'file'){
                state.userImg = res.data.data
            }else{
                state.colImg = res.data.data
            }
            
        }
        
        let userUd = async() =>{
            let userId = localStorage.getItem('userId');
            
            let result = await getUser({
                data:{
                    id:userId
                }
            })
            let myMsg = result.data.data

            let res = await userUpdate({
                data:{
                    nikeName:state.userNk,
                    describe:state.userDes,
                    img:state.userImg,
                    userId:userId
                }
            })
            let myColumnId = store.state.myColumn[0].id
            setTimeout(async()=>{
                await articleArt({
                    data:{
                        aName:state.userNk,
                        aDescribe:state.userDes,
                        aImg:state.userImg,
                        oColumnId:myColumnId,
                    }
                })
                
            })
            setTimeout(async()=>{
                console.log(1)
                await updateComment({
                    data:{
                        nikeName:myMsg[0].nikeName,
                        newName:state.userNk
                    }
                })
            })
            
            
            if(state.userNk != myMsg[0].nikeName || state.userDes != myMsg[0].des || state.userImg != myMsg[0].img){
                state.tipText.innerHTML = '个人信息修改成功'
                state.isAction = true
                setTimeout(()=>{
                    state.isAction = false
                },2000)
            }
            
        }

        let colUpdate = async() =>{
            let userId = localStorage.getItem('userId');
            let result = await getMyColumn({
                data:{
                    userId: userId
                }
            })

            let myColumn = result.data.data
            let colId = myColumn[0].id
            let res = await updateCol({
                data:{
                    title : state.columnName,
                    colDes : state.columnDes,
                    img : state.colImg,
                    colId : colId
                }
            })
            if(state.columnName != myColumn[0].title || state.columnDes != myColumn[0].colDes || state.colImg != myColumn[0].img){
                state.tipText.innerHTML = '个人专栏信息修改成功'
                state.isAction = true
                setTimeout(()=>{
                    state.isAction = false
                },2000)
            }
            
        }

        onMounted(async()=>{
            let userId = localStorage.getItem('userId');
            let res = await getUser({
                data:{
                    id:userId
                }
            })
            let myMsg = res.data.data
            state.userImg = myMsg[0].img
            state.userNk = myMsg[0].nikeName
            state.userDes = myMsg[0].des
            store.commit('getMyMsg',myMsg)

            let result = await getMyColumn({
                data:{
                    userId: userId
                }
            })

            let myColumn = result.data.data
            state.colImg = myColumn[0].img
            state.columnName = myColumn[0].title
            state.columnDes = myColumn[0].colDes
            store.commit('getMyColumn',myColumn)
            
        })

        return{
            chooseOpt,
            isNull,
            uploadMyFile,
            userUd,
            colUpdate,
            fileClick,
            myColumn:computed(()=>store.state.myColumn),
            ...toRefs(state)
        }
    }
}

</script>
<style lang='scss' scoped>
#myEdit {
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
    .editBox{
        width:50%;
        margin: 0 auto;
        box-sizing: border-box;
        .editOpt{
            list-style: none;
            display:flex;
            margin-top:30px;
            border-bottom:1px solid #ccc;
            padding-left:0;
            padding:10px 0;
            li{
                box-sizing: border-box;
                .mainEdit{  
                    cursor: pointer;
                    margin-bottom: -1px;
                    padding:10px;
                    color:#0d6efd;
                    border:1px solid #ccc;
                    border-color:#fff #fff #dee2e6;
                    &.active{
                        color:black;
                        border-color:#dee2e6 #dee2e6 #fff;
                    } 
                }
                
            }
        }
        h1{
            margin:10px 0;
        }
        .imgFile{
            position: relative;
            box-sizing: border-box;
            margin:20px 0 ;
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
            }
        }
        .mainIpt{  
            .nameIpt{
                position: relative;
                margin-bottom: 25px;
                input{
                    display:block;
                    width:97%;
                    padding:10px;
                    border-radius:5px;
                    font-size: 16px;
                }
                span{
                    display: none;
                    position:absolute;
                    color:red;
                }
            }
            .desIpt{
                margin-bottom: 40px;
                position: relative;
                box-sizing: border-box;
                textarea{
                    display:block;
                    width:100%;
                    height:150px;
                    font-size: 16px;  
                    border-radius:5px;  
                }
                span{
                    display: none;
                    position:absolute;
                    color:red;
                }
            }
        }
        .submitIpt{
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
</style>