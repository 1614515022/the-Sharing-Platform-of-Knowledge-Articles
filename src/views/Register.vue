<template>
  <div id="nav">
    <NavBar/>
    <div class='action' v-show='isAction'>
        <h4 ref='tipText'></h4>
    </div>
    <div class='loginBox'>
        <h2>注册</h2>
        <form class='loginForm'>
            <div class='e-mailBox'>
               <label class='form-label'>邮箱地址</label>
               <div class='e-mailInput'>
                   <input type='text' name='e-mail' @blur='isNull' v-model='email' placeholder="请输入邮箱地址">
                   <span ref='emailText'>电子邮箱地址不能为空</span>
               </div>
            </div>
            <div class='nikeNameBox'>
               <label class='form-label'>昵称</label>
               <div class='nikeNameInput'>
                   <input type='text' name='nikeName' @blur='isNull' v-model='nikeName' placeholder="请输入昵称">
                   <span ref='nikeNameText'>昵称不能为空</span>
               </div>
            </div>
            <div class='passwordBox'>
                <label class='form-label'>密码</label>
               <div class='passwordInput' style='margin-bottom:10px'>
                   <input type='password' name='password' @blur='isNull' v-model='password' placeholder='请输入密码'>
                   <span ref='passwordText'>密码不能为空</span>
               </div>
               <label class='form-label'>重复密码</label>
               <div class='passwordInput'>
                   <input type='password' name='rePassword' @blur='isNull' v-model='rePassword' placeholder='请输入重复密码'>
                   <span ref='rePasswordText'>重复密码不能为空</span>
               </div>
               <div class='toLogin'>
                   <a href='/#/login'>已经有账户了？去登录</a>
               </div>
            </div>
            <div class='submitBox'>
                <input type='button' ref='register' value='注册' @click='submit' />
            </div>
        </form>
    </div>  
    
  </div>
</template>

<script>
import { userCreate } from '@/services/userRequest';
import { reactive,toRefs,onMounted } from 'vue';
import { useRouter } from 'vue-router'

export default {
    name:'Register',
    setup(){
        let state = reactive({
            email : '',
            password : '',
            nikeName:'',
            rePassword:'',
            isAction:false,
            tipText:'',
            emailText:null,
            passwordText:null,
            nikeNameText:null,
            rePasswordText:null,
            register:null
        })
        let router = useRouter();

        let submit = async() =>{
           let res = await userCreate({data:{
               email:state.email,
               password:state.password,
               nikeName:state.nikeName,
               rePassword:state.rePassword,
           }}); 
           if(res.data.code == 200){
               state.tipText.innerHTML = res.data.msg
               state.isAction = true
               setTimeout(()=>{
                   state.isAction = false
                   router.push('/login') 
               },500)
           }else{
               state.tipText.innerHTML = res.data.msg
               state.isAction = true
               setTimeout(()=>{
                   state.isAction = false
               },500)
           }
        }
        document.onkeypress = function(e) {
            let keycode = document.all ? event.keyCode : e.which;
            if(keycode == 13){
                submit();
            }  
        }
        let isNull = (e) =>{
            switch(e.target.name){
                case 'e-mail':
                    if(state.email.length == 0){
                        state.emailText.style.display = "block"
                        
                    }else{
                        state.emailText.style.display = "none"
                    }
                    break
                case 'nikeName':
                    if(state.nikeName.length == 0){
                        state.nikeNameText.style.display = "block"
                    }else{
                        state.nikeNameText.style.display = "none"
                    }
                    break
                case 'password':
                    if(state.password.length == 0){
                        state.passwordText.style.display = "block"
                    }else{
                        state.passwordText.style.display = "none"
                    }
                    break
                case 'rePassword':
                    if(state.rePassword.length == 0){
                        state.rePasswordText.style.display = "block"
                    }else{
                        state.rePasswordText.style.display = "none"
                    }
                    break
                default:
                    break
            }
            
        }
        onMounted(()=>{
            
        })
        return{
            ...toRefs(state),
            submit,
            isNull
        }
    }
}

</script>
<style lang='scss' scoped>
#nav{
    .action{
        box-sizing: border-box;
        padding:10px 20px;
        border:1px solid #ccc;
        background-color: #ccc;
        width:10%;
        border-radius: 10px;
        position: fixed;
        top:34%;
        left:44.5%;
        h4{
            text-align:center;
            color:red;
            
        }
    }
    .loginBox{
        width:330px;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        padding:20px;
        margin-top:50px;
        h2{
            text-align:center;
            margin:30px 0;
        }
        .loginForm{
            .e-mailBox{
                font-size:16px;
                box-sizing: border-box;
                margin-bottom: 20px;
                .form-label{
                    display: inline-block;
                    margin-bottom: 10px;
                }
                .e-mailInput{
                    input{
                        width:92%;
                        padding:10px;
                        border-radius: 5px;
                    }
                }
                span{
                    display: none;
                    position: absolute;
                    color:red;
                }
            }
            .nikeNameBox{
                font-size:16px;
                box-sizing: border-box;
                margin-bottom: 10px;
                .form-label{
                    display: inline-block;
                    margin-bottom: 10px;
                }
                .nikeNameInput{
                    input{
                        width:92%;
                        padding:10px;
                        border-radius: 5px;
                    }
                }
                span{
                    display: none;
                    position: absolute;
                    color:red;
                }
            }
            .passwordBox{
                font-size:16px;
                box-sizing: border-box;
                .form-label{
                    display: inline-block;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                .passwordInput{
                    input{
                        width:92%;
                        padding:10px;
                        border-radius: 5px;
                    }
                }
                .toLogin{
                    margin-top: 20px;
                }
                span{
                    display: none;
                    position: absolute;
                    color:red;
                }
            }
            .submitBox{
                text-align:center;
                margin-top:20px;    
                box-sizing: border-box;
                input{
                    display:block;
                    width:100%;
                    background-color:#0d6efd;
                    border-color: #0d6efd;
                    border-radius: 5px;
                    padding:10px 20px;
                    color:white;
                    cursor: pointer;
                }
            }
        }
        
    }
}
</style>