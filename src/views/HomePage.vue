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
const selectedCategory = ref(0)

onMounted(() => {
  loadCategory()
})

const categoryName = computed(() => {
  let selectedOption = categoryOptions.value.find((option) => {
    return option.value === selectedCategory.value
  })
  return selectedOption ? selectedOption.label : ''
})

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
