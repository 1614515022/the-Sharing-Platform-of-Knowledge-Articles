    <template>
  <div id="nav">
    <NavBar/>
    <div class='action' v-show='isAction'>
        <h4 ref='tipText'></h4>
    </div>
    <div class='loginBox'>
        <h2>登录</h2>
        <form class='loginForm'>
            <div class='e-mailBox'>
               <label class='form-label'>邮箱地址</label>
               <div class='e-mailInput'>
                   <input type='text' name='e-mail' @blur='isNull' v-model='email' placeholder="请输入邮箱地址">
                   <span ref='emailText'>电子邮箱地址不能为空</span>
               </div>
            </div>
            <div class='passwordBox'>
               <label class='form-label'>密码</label>
               <div class='passwordInput'>
                   <input type='password' name='password' @blur='isNull'  v-model='password' placeholder='请输入密码'>
                   <span ref='passwordText'>密码不能为空</span>
               </div>
               <div class='toRegister'>
                   <a href='/#/register'>还没有账号？去注册一个新账号吧。</a>
               </div>
            </div>
            <div class='submitBox'>
                <input type='button' value='登录' @click='submit' />
            </div>
        </form>
    </div>  
    
  </div>
</template>

<script>
import { userLogin } from '@/services/userRequest';
import { reactive,toRefs,onMounted } from 'vue';
import { useRouter } from 'vue-router'

export default {
    name:'Login',
    setup(){
        let state = reactive({
            email : '',
            password : '',
            isAction:false,
            tipText:'',
            emailText:'',
            passwordText: ''
        })
        let router = useRouter();

        let submit = async() =>{
            let res = await userLogin({data:{
               email:state.email,
               password:state.password
            }})

           
            if(res.data.code == 200){
                let userId = res.data.data.data.id;
                localStorage.setItem("userId", userId);
                let token = res.data.data.token;
                localStorage.setItem('myToken',token)
                state.tipText.innerHTML = res.data.msg
                 state.isAction = true
                setTimeout(()=>{
                    state.isAction = false
                    router.push('/') 
                },2000)
            }else{
                state.tipText.style.color = 'red'
                state.tipText.innerHTML = res.data.msg
                state.isAction = true
                setTimeout(()=>{
                    state.isAction = false
                },2000)
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
                case 'password':
                    if(state.password.length == 0){
                        state.passwordText.style.display = "block"
                    }else{
                        state.passwordText.style.display = "none"
                    }
                    break
                default:
                    break
            }
            
        }
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
                margin-bottom: 10px;
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
                .toRegister{
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