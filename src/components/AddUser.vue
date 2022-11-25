<template>
    <n-modal preset="dialog" title="Dialog">
        <template #header>
            <div>添加用户</div>
        </template>
        <n-card :bordered="false">
            <n-form ref="loginRef" :model="user" :rules="rules">
                <n-form-item label="用户名" path="username">
                    <n-input v-model:value="user.uname" placeholder="输入用户名" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                    <n-input type="password" v-model:value="user.upwd" placeholder="输入密码" />
                </n-form-item>
            </n-form>
            <n-button type="info" block secondary strong @click="addUser">
                添加用户
            </n-button>
        </n-card>
    </n-modal>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { useMessage, useDialog } from 'naive-ui';
import { createUser } from "../hooks/admin";

const dialog = useDialog()
const message = useMessage()
let user = ref({
    uname: "",
    upwd: ""
})

const addUser = () => {
    dialog.warning({
        title: '警告',
        content: '你确定添加此用户吗?',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
            console.log(user.value);
            let userStatus = await createUser(user.value);
            if (userStatus.data.status == 200) {
                message.success("添加成功");
            } else {
                message.error("添加失败");
            }
        },
        onNegativeClick: () => {
        }
    })
}
</script>

<style>

</style>