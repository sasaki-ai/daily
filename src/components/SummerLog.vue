<template>
    <n-modal preset="dialog" title="Dialog">
        <template #header>
            <div>支出报告</div>
        </template>
        <n-date-picker v-model:value="range" type="daterange" clearable />
        <n-data-table v-if="wordShow" :columns="columns" :data="data" :bordered="false" />
        <template #action>
            <n-button type="info" @click="createWord">
                支出报告
            </n-button>
        </template>
    </n-modal>
</template>

<script setup>
import { ref } from "@vue/runtime-core";
import { paying } from "../hooks/bill";
const uid = localStorage.getItem("uid");
let wordShow = ref(false);
let range = ref([118313526e4, Date.now()]);
const columns = ref([
    {
        title: "类型",
        key: "type"
    },
    {
        title: "金额",
        key: "amount"
    },
]);
let data = ref([]);

const createWord = async () => {
    wordShow.value = true;
    let word = await paying({ uid, date: range.value });
    data.value = Array.apply(null, word.data.data).map((target, index) => ({
        amount: target.amount,
        type: target.type
    }));
}
</script>

<style>

</style>