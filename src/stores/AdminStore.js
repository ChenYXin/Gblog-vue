import {defineStore} from 'pinia'

export const AdminStore = defineStore('admin', {
    state: () => {
        return {
            ID:0,
            username:"",
            token: "",
        }
    },
    actions: {
    },
    getters: {
        
    }
})