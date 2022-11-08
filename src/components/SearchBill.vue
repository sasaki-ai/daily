<template>
    <n-modal preset="dialog" title="Dialog">
        <template #header>
            <div>搜索账单</div>
        </template>
        <n-date-picker v-model:value="range" type="daterange" clearable />
        <template #action>
            <n-button type="info">
                搜索
            </n-button>
        </template>
    </n-modal>
</template>

<script setup>
import { ref } from "@vue/runtime-core";
let range = ref([118313526e4, Date.now()]);
</script>

<style>

</style>