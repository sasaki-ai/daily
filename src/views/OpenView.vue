<template>
    <n-spin :show="show">
        <n-image width="400" :object-fit="cover" :src="imgSrc" class="img" />
        <template #description>
            加载配置中
        </template>
    </n-spin>
</template>

<script setup>
import { onMounted, ref } from '@vue/runtime-core';
import { readBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';

let imgSrc = ref();
let show = ref(false);

onMounted(async () => {
    const contents = await readBinaryFile('img/open.jpg', { 
        dir: BaseDirectory.Resource 
    });
    let binary_data_arr = new Uint8Array(contents);
    let p1 = new Blob([binary_data_arr], {type: 'image/jpg'});
    let assetUrl = URL.createObjectURL(p1)
    imgSrc.value = assetUrl;
    show.value = true;
})
</script>

<style scoped>
.img {
    border-radius: 2em;
}
</style>