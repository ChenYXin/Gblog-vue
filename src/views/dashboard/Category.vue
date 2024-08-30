<template>
  <div>
    <n-button @click="showAddModal = true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categoryList">
          <td>{{ index }}</td>
          <td>{{ category.name }}</td>
          <td>
            <n-space>
              <n-button @click="toUpdate(category)">修改</n-button>
              <n-button @click="deleteCategory(category)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
      <template #header>
        <div>添加分类</div>
      </template>
      <div>
        <n-input v-model:value="addCategory.name" type="text" placeholder="请输入分类名称" />
      </div>
      <template #action>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-modal>

    <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分类</div>
      </template>
      <div>
        <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入分类名称" />
      </div>
      <template #action>
        <div>
          <n-button @click="update">提交</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { AdminStore } from '@/stores/AdminStore.js'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const dialog = inject('dialog')
const message = inject('message')
const axios = inject('axios')
const adminStore = AdminStore()

const showAddModal = ref(false)
const showUpdateModal = ref(false)
const categoryList = ref([])
const addCategory = reactive({
  name: ''
})

const updateCategory = reactive({
  id: 0,
  name: ''
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  let res = await axios.get('/api/v1/categoryList')
  console.log(res.data)
  categoryList.value = res.data.data
}

const add = async () => {
  let res = await axios.post(
    '/api/v1/category/add',
    { name: addCategory.name },
    { headers: { token: adminStore.token } }
  )
  console.log(res.data.status)
  if (res.data.status === 200) {
    await loadData()
    message.info(res.data.message)
  } else {
    message.error(res.data.message)
  }
  showAddModal.value = false
}

const update = async () => {
  let res = await axios.put(
    `/api/v1/category/${updateCategory.id}`,
    { id: updateCategory.id, name: updateCategory.name },
    { headers: { token: adminStore.token } }
  )
  if (res.data.status === 200) {
    await loadData()
    message.info(res.data.message)
  } else {
    message.error(res.data.message)
  }
  showUpdateModal.value = false
}

const toUpdate = async (category) => {
  showUpdateModal.value = true
  updateCategory.id = category.id
  updateCategory.name = category.name
}

const deleteCategory = async (category) => {
  dialog.warning({
    title: '警告',
    content: '你确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let res = await axios.delete(`/api/v1/category/${category.id}`, {
        headers: { token: adminStore.token }
      })
      if (res.data.status === 200) {
        await loadData()
        message.info(res.data.message)
      } else {
        message.error(res.data.message)
      }
    },
    onNegativeClick: () => {}
  })
}
</script>

<style lang="scss" scoped></style>
