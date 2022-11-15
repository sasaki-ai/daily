<template>
    <n-spin :show="show">
        <n-image width="400" :object-fit="cover" :src="imgSrc" class="img" />
        <template #description>
            加载配置中
        </template>
    </n-spin>
</template>

<script setup>
import { resourceDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { onMounted, ref } from '@vue/runtime-core';

let imgSrc = ref();

onMounted(async () => {
    const resourceDirPath = await resourceDir();
    const filePath = await join(resourceDirPath, 'img', "open.jpg");
    const assetUrl = convertFileSrc(filePath);
    console.log(assetUrl)
    imgSrc.value = assetUrl;
})
</script>

<style scoped>
.img {
    border-radius: 2em;
}
</style>