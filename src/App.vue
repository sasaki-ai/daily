<template>
  <n-dialog-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-dialog-provider>
  <h1>跟新完毕</h1>
  <button @click="updatemsg">跟新信息</button>
  <button @click="updateins">安装和下载</button>
</template>

<script setup>
//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
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { emit } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
try {
  const { shouldUpdate, manifest } = await checkUpdate()
  if (shouldUpdate) {
    // display dialog
    await installUpdate()
    // install complete, restart app
    await relaunch()
  }
} catch (error) {
  console.log(error)
}

const updatemsg = () => {
  emit('tauri://update')
  listen('tauri://update-available', function (res) {
    console.log('New version available: ', res)
    alert(res);
  })
}

const updateins = () => {
  emit('tauri://update-install')
  listen('tauri://update-status', function (res) {
    console.log('New status: ', res)
    alert(res);
    if (res == "ERROR") {
      alert("error")
    } else if(res == "PENDING") {
      alert("下载开始")
    } else if(res == "DONE") {
      alert("下载完成")
    }
  })
}
</script>

<style>

</style>
