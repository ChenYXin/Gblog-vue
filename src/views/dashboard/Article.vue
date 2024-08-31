<template>
  <div>
    <n-tabs default-value="add" justify-content="start" type="line">
      <n-tab-pane name="oasis" tab="Oasis"> Wonderwall </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="addArticle.content"/>
        </n-form-item>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
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
  categoryId: 0,
  title: '',
  content: ''
})

</script>

<style lang="scss" scoped></style>
