<template>
  <div>
    <n-tabs default-value="list" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog, index) in blogListInfo" style="margin-top: 15px">
          <n-card :title="blog.title">
            {{ blog.content }}
            <template #footer>
              <n-space align="center">
                <div>发布时间：{{ blog.created_at }}</div>
                <n-button>修改</n-button>
                <n-button>删除</n-button>
              </n-space>
            </template>
          </n-card>
        </div>

        <n-space>
          <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
            <div :style="'color:' + (pageNum - 1 === pageInfo.pageSize ? 'blue' : 'green')">
              {{ pageNum }}
            </div>
          </div>
        </n-space>
      </n-tab-pane>
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
const blogListInfo = ref([])

const pageInfo = reactive({
  pageSize: 0,
  pageNum: 3,
  pageCount: 0,
  count: 0
})

onMounted(() => {
  loadBlogs()
  loadCategory()
})
const loadBlogs = async () => {
  let res = await axios.get(
    `/api/v1/articleList?pageSize=${pageInfo.pageSize}&pageNum=${pageInfo.pageNum}`
  )
  let temp_rows = res.data.data
  for (let row of temp_rows) {
    if (row.content.length >= 100) {
      row.content = row.content.slice(0, 100).toString() + '...'
    }
    let d = new Date(row.created_at)
    row.created_at = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    // row.created_at = d.toLocaleString()
  }
  pageInfo.count = res.data.total
  pageInfo.pageCount =
    parseInt(pageInfo.count / pageInfo.pageNum) + (pageInfo.count % pageInfo.pageNum > 0 ? 1 : 0)
  blogListInfo.value = temp_rows
}

const loadCategory = async () => {
  let res = await axios.get('/api/v1/categoryList')
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

const toPage = async (pageNum) => {
  pageInfo.pageSize = pageNum - 1
  await loadBlogs()
}
</script>

<style lang="scss" scoped></style>
