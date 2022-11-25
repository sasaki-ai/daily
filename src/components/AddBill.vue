<template>
    <n-modal preset="dialog" title="Dialog" :on-after-leave="clear">
        <template #header>
            <div>添加账单</div>
        </template>
        <n-dynamic-input v-model:value="bills" :on-create="onCreate">
            <template #create-button-default>
                添加账单
            </template>
            <template #default="{ value }">
                <n-input-group>
                    <n-input v-model:value="value.amount" :style="{ width: '50%' }" placeholder="金额" />
                    <n-select v-model:value="value.type" :options="typeOption" :style="{ width: '50%' }"
                        placeholder="类型" />
                    <n-date-picker v-model:value="value.date" type="date" placeholder="日期" />
                </n-input-group>
            </template>
        </n-dynamic-input>
        <template #action>
            <n-button type="info" @click="addBill">
                添加
            </n-button>
        </template>
    </n-modal>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { useMessage, useDialog } from 'naive-ui';
import { create } from "../hooks/user";

const uid = localStorage.getItem("uid");
const dialog = useDialog();
const message = useMessage();
let bills = ref([]);
const typeOption = ref([
    {
        label: "饮食",
        value: "饮食"
    },
    {
        label: "工具",
        value: "工具"
    },
    {
        label: "游玩",
        value: "游玩"
    },
    {
        label: "其他",
        value: "其他"
    },
])
const onCreate = () => {
    return {
        uid: uid,
        amount: "",
        type: [],
        date: null,
    }
}
const addBill = () => {
    dialog.warning({
        title: '警告',
        content: '你确定添加账单吗?',
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: async () => {
            let billState = await create(bills.value);
            if (billState.data.status == 200) {
                bills.value = [];
                message.success("添加成功");
            } else {
                message.error("添加失败");
            }
        }
    })
}
const clear = () => {
    bills.value = [];
}
</script>

<style>

</style>
