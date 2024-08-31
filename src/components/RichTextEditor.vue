<!-- 富文本组件 -->
<template>
  <div>
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
             style="border-bottom: 1px solid #ccc" />
    <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { AdminStore } from '@/stores/AdminStore.js'

const axios = inject('axios')
const adminStore = AdminStore()
const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys:["uploadVideo"] };
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
// editorConfig.MENU_CONF['uploadImage'] = {
//   base64LimitSize: 10 * 1024, // 10kb
//   server: server_url+'/api/v1/file/upload',
//   // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
//   headers: {
//     token: adminStore.token,
//   },
// }
editorConfig.MENU_CONF['uploadImage'] = {
  base64LimitSize: 10 * 1024, // 10kb
  // server: server_url+'/api/v1/file/upload',
  // headers: {
  //   token: adminStore.token,
  // },
  // 自定义上传
  async customUpload(file, insertFn) {
    let formData = new FormData();
    formData.append("file", file); // file 即选中的文件
    var config = {
      method: "post",
      url: server_url+'/api/v1/file/upload', //上传图片地址
      headers: {
        "Content-Type": "multipart/form-data",
        "token": adminStore.token,
      },
      data: formData
    };
    await axios(config)
      .then(function(res) {
        // let url = "https://xxx域名/" + res.data.data.path; //拼接成可浏览的图片地址
        // insertFn(url, "使用说明", url); //插入图片
        console.log(res.data);
        insertFn(res.data.url, "使用说明", res.data.url); //插入图片
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

//拼接图片前缀
// editorConfig.MENU_CONF['insertImage'] ={
//   parseImageSrc:(src) =>{
//     if(src.indexOf("http") !==0){
//       return `${server_url}${src}`
//     }
//     return src
//   }
// }

const mode = ref("default")
const valueHtml = ref("")

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(["update:model-value"])
let initFinished = false

onMounted(() => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
    initFinished = true;
  }, 200);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log('created', editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  if (initFinished) {
    emit("update:model-value", valueHtml.value)
  }
};

</script>

<style lang="scss" scoped>
</style>