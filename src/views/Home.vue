<template>
  <div id="home">
    <NavBar/>
    <div class='action' v-show='isAction'>
        <h4 ref='tipText'></h4>
    </div>
    <div class='center'>
      <img src='@/assets/1.svg'>
      <h1>随心写作，自由表达</h1>
      <a @click='createArticle'>开始写文章</a>
    </div>
    <h1>发现精彩</h1>
    <div class='contentBox'>
      <div class='content' v-for='(item,index) of columnList' :key='index'>
        <img :src='item.img'/>
        <h2>{{item.title}}</h2>
        <p>{{item.colDes}}</p>
        <a :href="(`#/oColumn/${item.id}`)">进入专栏</a>
      </div>
      <div class='loadMore'>
        <a @click='loadMore'>加载更多</a>
      </div>
    </div>
    
  </div>
</template>

<script>
import { getColumn } from '../services/columnRequest';
import { onMounted,computed,reactive,toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  setup(){
    let state = reactive({
      isAction : false,
      tipText:'',
    })
    const store = useStore(),
          router = useRouter();
    let createArticle = () =>{
      if(localStorage.getItem('myToken').length != 0 ){
        setTimeout(()=>{
          router.push('/createArticle')
        },500);
      }else{
        setTimeout(()=>{
          state.tipText.style.color = 'red';
          state.tipText.innerHTML = '您还未登陆,两秒后跳转至登录页'
          state.isAction = "true"
          setTimeout(()=>{
            router.push('/login')
          },2000)
        },500)
      }
    }
    let loadMore = async(e) =>{
      let res = await getColumn()
      let resArr = []
      for(let i=0;i<res.data.length;i=i+6){
        resArr.push(res.data.slice(i,i+6))
      }
      let length = store.state.columnList.length
      if(res.data.length - length >= 6){
        resArr[length/6].forEach((item)=>{
          store.commit('pushColumnList',item)
        })
      }else{
        //console.log(1)
        for(let i=length;i<res.data.length;i++){
          if(res.data[i].id != store.state.columnList.id){
            store.commit('pushColumnList',res.data[i])
          }
        }
      }
      
      //store.commit('pushColumnList',resArr[length/6])
      if(res.data.length - length <= 6){
        e.target.parentNode.style.display = 'none'
      }
    }
    onMounted(async()=>{
      let res = await getColumn()
      let resArr = []
      for(let i=0;i<res.data.length;i=i+6){
        resArr.push(res.data.slice(i,i+6))
      }
      store.commit('getColumnList',resArr[0])
    })
    return{
      columnList:computed(()=>store.state.columnList),
      createArticle,
      loadMore,
      ...toRefs(state)
    }
  }
}
</script>
<style lang='scss' scoped>
#home{
  height:5000px;
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
  .center{
    width:300px;
    margin: 100px auto;
    text-align: center;
    img{
      width:100%;
    }
    h1{
      margin-bottom: 30px;
    }
    a{
      cursor: pointer;
      border:1px solid  #0d6efd;
      padding:10px 20px;
      border-radius:10px;
      background-color:  #0d6efd;
      color:white;
      text-decoration: none;
    }
    a:hover{
      background-color: blue;
    }
  }
  h1{
    text-align:center;
    margin-bottom: 30px;
  }
  .contentBox{
    margin-left:100px;
    margin-right:100px;
    display:flex;
    flex-wrap: wrap;
    float:left;
  
    .content{
      position: relative;
      width:29%;
      height: 200px;
      padding:30px 10px;
      margin:10px 10px;
      text-align: center;
      border:2px solid #ccc;
      img{
        border:1px solid #ccc;
        width:20%;
        border-radius: 66.6px;
        margin:0 auto;
      }
      a{
        text-decoration:none;
        border:1px solid  #0d6efd;
        border-radius: 10px;
        padding:5px 10px;
        color: #0d6efd;
        position: absolute;
        bottom:10px;
        left:130px;
      }
      a:hover{
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

</style>
