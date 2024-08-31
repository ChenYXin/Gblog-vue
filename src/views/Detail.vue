<template>
  <div class="container">
    <n-button @click="back">返回</n-button>
    <!--    标题-->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!--    文章内容-->
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
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

const blogInfo = ref({})
onMounted(() => {
  loadBolg()
})
const loadBolg = async () => {
  console.log(route)
  let res = await axios.get(`/api/v1/article/${route.query.id}`)
  blogInfo.value = res.data.data
}
const back = () => {
  router.push('/')
}
</script>
<style>
.blog-content img {
  max-width: 100% !important;
}
</style>
<style lang="scss" scoped>
.container {
  width: 90%;
  margin: 0 auto;
}
</style>
