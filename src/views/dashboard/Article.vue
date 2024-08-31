<template>
  <div>
    <n-tabs default-value="add" justify-content="start" type="line">
      <n-tab-pane name="oasis" tab="Oasis"> Wonderwall</n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="addArticle.content" />
        </n-form-item>
        <n-form-item label="">
          <n-button @click="add">提交</n-button>
        </n-form-item>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香</n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { AdminStore } from '@/stores/AdminStore.js'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '@/components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()

const dialog = inject('dialog')
const message = inject('message')
const axios = inject('axios')
const adminStore = AdminStore()

const addArticle = reactive({
  categoryId: 7,
  title: '',
  content: ''
})

const categoryOptions = ref([])
onMounted(() => {
  loadCategory()
})

const loadCategory = async () => {
  let res = await axios.get('/api/v1/categoryList', { headers: { token: adminStore.token } })
  categoryOptions.value = res.data.data.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  console.log(categoryOptions.value)
}

const add = async () => {
  let res = await axios.post(
    '/api/v1/article/add',
    {
      cid: addArticle.categoryId,
      title: addArticle.title,
      // description: addArticle.description,
      // img: addArticle.img,
      content: addArticle.content
    },
    { headers: { token: adminStore.token } }
  )
  console.log(res.data.status)
  if (res.data.status === 200) {
    message.info(res.data.message)
    addArticle.categoryId = 0
    addArticle.title = ''
    addArticle.content = ''
  } else {
    message.error(res.data.message)
  }
}
</script>

<style lang="scss" scoped></style>
