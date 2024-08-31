<template>
  <div class="container">
    <div class="nav">
      <div @click="homePage">首页</div>
      <div>
        <n-popselect v-model:value="selectedCategory" :options="categoryOptions" trigger="click">
          <div>
            分类<span>{{ categoryName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="dashboard">后台</div>
    </div>
    <n-divider />
    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      ></n-input>
      <n-button type="primary" ghost @click="loadBlogs(0)">搜索</n-button>
    </n-space>
    <div v-for="(blog, index) in blogListInfo" style="margin-top: 15px">
      <n-card :title="blog.title">
        {{ blog.content }}
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.created_at }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.pageSize"
      :page-count="pageInfo.pageCount"
    />
    <n-divider />
    <div class="footer">
      <div>Power by xxx</div>
      <div>XICP备xxxxx号1</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const dialog = inject('dialog')
const message = inject('message')
const axios = inject('axios')

const categoryOptions = ref([])
const blogListInfo = ref([])
const selectedCategory = ref(0)
const pageInfo = reactive({
  pageSize: 0,
  pageNum: 2,
  pageCount: 0,
  count: 0,
  keyword: ''
})

onMounted(() => {
  loadBlogs()
  loadCategory()
})

const categoryName = computed(() => {
  let selectedOption = categoryOptions.value.find((option) => {
    return option.value === selectedCategory.value
  })
  return selectedOption ? selectedOption.label : ''
})

const loadBlogs = async (page) => {
  if (page !== 0) {
    pageInfo.pageSize = page - 1
  } else {
    pageInfo.pageSize = 0
  }
  let res = await axios.get(
    `/api/v1/articleList?pageSize=${pageInfo.pageSize}&pageNum=${pageInfo.pageNum}&keyword=${pageInfo.keyword}`
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

const homePage = () => {
  router.push('/')
}
const dashboard = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 15px;
}

.container {
  width: 100%;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;

  div {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: #f60;
    }

    span {
      font-size: 12px;
    }
  }
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
