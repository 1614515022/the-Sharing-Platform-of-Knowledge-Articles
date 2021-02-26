<template>
  <div id='nav'>
      <div class='navBar'>
            <a class='navTitle' href='/'>钟氏专栏</a>
            <label class='searchIpt'>
                <input type='text'
                 v-model='searchIpt' 
                 placeholder="请输入关键字" 
                 v-mySearch='{
                        searchIpt:searchIpt,
                    }' />
                <ul class='searchText'>
                    <li class='hotSearch'><a>热搜</a></li>
                </ul>
            </label>
            
            <ul class='navOpt' v-show='!token'>
                <li>
                    <a href='/#/login'>登录</a>
                </li>
                <li>
                    <a href='/#/register'>注册</a>
                </li>
            </ul>
          
          <div class='menberOpt' v-show='token'>
              <a class='mainOpt'>你好 {{userNk}}</a>
              <ul class='allOpt'>
                  <li><a href='#/createArticle'>新建文章</a></li>
                  <li @click='myColumn'><a>我的专栏</a></li>
                  <li><a href='#/edit'>编辑资料</a></li>
                  <li><a href='#/myCollect'>收藏列表</a></li>
                  <li><a @click='quit'>退出登录</a></li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
import { reactive,toRefs,onMounted,watch,computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getSibiling } from '@/libs/utils.js';
import { getMyColumn,searchAll } from '@/services/columnRequest';
import { getUser } from '@/services/userRequest';
import { mySearch } from '@/directives';
import $ from 'jquery';
export default {    
    name:'NavBar',
    directives:{
        mySearch
    },
    setup(props,ctx){
        const state = reactive({
            searchIpt:'',
            userNk:''
        })

        let store = useStore(),
            router = useRouter();

        let quit = () =>{
            localStorage.setItem('userId','');
            localStorage.setItem('myToken','');
            setTimeout(() =>{
                router.push('/login')
            },500)
        }

        let myColumn = async() =>{
            let userId = localStorage.getItem('userId');
            let res = await getMyColumn({
                data:{
                    userId:userId
                }
            })
            if(res.data.code == 404){
                router.push('/createColumn')
            }else{
                let id = res.data.data[0].id
                store.commit('getMyColumn',id)
                router.push(`/oColumn/${id}`)
            }
            
        }

        watch(()=>{
            return router.currentRoute.value.href   
        },()=>{
            router.go(0)
        })
        onMounted(async()=>{
            let userId = localStorage.getItem('userId');
            $('.allOpt').mouseover((e) =>{
                if(e.target.tagName === 'LI'){
                    e.target.style.background = "#ccc";
                    getSibiling(e.target).forEach(item=>item.style.background = "white");
                }
            })
            let res = await getUser({
                data:{
                    id:userId
                }
            })
            state.userNk = res.data.data[0] ? res.data.data[0].nikeName : '';
        })

        let token = localStorage.getItem('myToken')
        

        return{
            token,
            myColumn,
            quit,
            ...toRefs(state),
        }
    }
}

</script>
<style lang='scss' scoped>
    #nav{
        width: 100%;
        background-color: #0d6efd;
        .navBar{
            width:75%;
            margin: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top:15px;
            padding-bottom:15px;
            .navTitle{
                text-decoration: none;
                font-size:20px;
                color:white;
            }
            .searchIpt{
                position: relative;
                transform: translate(40px,0);
                input{
                    background-color:white;
                    border:1px solid white;
                    border-radius: 10px;
                    padding:8px 30px;
                    
                }
                .searchText{
                    position: absolute;
                    width:200px;
                    height:200px;
                    background-color: white;
                    border:1px solid #ccc;
                    top:35px;
                    left:0;
                    border-radius: 10px;
                    list-style: none;
                    padding:10px 15px;
                    display: none;
                    li{
                        cursor: pointer;
                        a{
                            width:100%;
                        }
                    }
                }
            }
            
            .navOpt{
                list-style: none;
                li{
                    display: inline-block;
                    a{
                        text-decoration: none;
                        color:white;
                        display: inline-block;
                        border:1px solid white;
                        border-radius: 5px;
                        font-size:15px;
                        padding:10px 15px;
                    }
                    a:hover{
                        background-color:white;
                        color:black;
                    }
                }
                li:nth-child(1){
                    margin-right:10px;
                }
            }
            .menberOpt{
                position: relative;
                transform: translate(70px,0px);
                .mainOpt{
                    font-size:18px;
                    border:1px solid white;
                    border-radius: 10px;
                    padding:5px 30px;
                    cursor: pointer;
                    color:white;
                }
                .mainOpt:hover{
                    background-color: white;
                    color: black;
                }
                .mainOpt:hover ~.allOpt {
                    transform: scale(1);
                    
                }
                .allOpt{
                    cursor: pointer;
                    transition: 0.5s;
                    position:absolute;
                    transform: translate(0px,-100px);
                    transform-origin: left top;
                    transform: scale(0);
                    box-sizing: border-box;
                    list-style: none;
                    border:1px solid rgba(0,0,0,.15);
                    border-radius:10px;
                    padding:10px 0;
                    background-color:white;
                    li{
                        padding:5px 15px;
                        width:150px;
                        a{ 
                            font-size:18px;
                            color:black;
                            text-decoration: none;
                        }
                    }
                }
                .allOpt:hover{
                    transform: scale(1);
                }
            }
        }
    }
</style>