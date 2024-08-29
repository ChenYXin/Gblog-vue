<template>
  <div class="login-panel">
    <n-card title="管理后台登陆">
     <n-form :rules="rules" :model="admin">
        <n-form-item path="username" lable="账号">
            <n-input v-model:value="admin.username" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" lable="密码">
            <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
        </n-form-item>
     </n-form>
     <template #footer>
        <n-checkbox v-model:checked="admin.rember" label="记住密码"/>
        <n-button @click="login">登陆</n-button>
     </template>
    </n-card>
  </div>
</template>

<script setup>
import { ref,reactive,inject} from 'vue'
import {AdminStore} from '../stores/AdminStore';
import {useRouter,useRoute} from 'vue-router'
const router = useRouter();
const route = useRoute();

const message = inject("message");
const axios = inject("axios");
const adminStore = AdminStore();


 

let rules ={
    username:[
        {required:true,message:"请输入账号",trigger:"blur"},
        {min:3,max:20,message:"账号长度在3-20个字符之间",trigger:"blur"},
    ],
    password:[
        {required:true,message:"请输入密码",trigger:"blur"},
        {min:6,max:20,message:"账号长度在6-20个字符之间",trigger:"blur"},
    ],
};

const admin = reactive({
    username:localStorage.getItem("username")||"",
    password:localStorage.getItem("password")||"",
    rember:localStorage.getItem("rember")==1||false,
});

const login = async() =>{
    let result = await axios.post("/api/v1/user/login",{
        username:admin.username,
        password:admin.password,
    });
    console.log(result);
    if(result.data.status == 200){
        adminStore.token=result.data.data.token;
        adminStore.username=result.data.data.username;
        adminStore.ID=result.data.data.id;
        if(admin.rember){
            localStorage.setItem("username",admin.username);
            localStorage.setItem("password",admin.password);
            localStorage.setItem("rember",admin.rember?1:0);
        }
        router.push("/dashboard")
        message.info("登陆成功");
    }else{
        // alert(result.message);
        message.error('登陆失败')
    }
};

</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
