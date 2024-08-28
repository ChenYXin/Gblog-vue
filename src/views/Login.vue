<template>
  <div class="login-panel">
    <n-card title="管理后台登陆">
     <n-form :rules="rules" :model="admin">
        <n-form-item path="username" lable="账号">
            <n-input v-model:value="admin.username" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" lable="密码">
            <n-input v-model:value="admin.password" placeholder="请输入密码" />
        </n-form-item>
     </n-form>
     <template #footer>
        <n-checkbox v-model:checked="admin.remember" label="记住密码"/>
        <n-button @click="login">登陆</n-button>
     </template>
    </n-card>
  </div>
</template>

<script setup>
import { ref,reactive,inject} from 'vue'
const axios = inject("axios");

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
    username:"",
    password:"",
    remember:false,
});

const login = async() =>{
    let result = await axios.post("/api/v1/user/login",{
        username:admin.username,
        password:admin.password,
    });
    console.log(result);
};

</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
