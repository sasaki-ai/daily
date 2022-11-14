<template>
  <n-dialog-provider>
    <n-message-provider>
      <n-spin :show="show">
        <router-view />
      </n-spin>
    </n-message-provider>
  </n-dialog-provider>
</template>

<script setup>
//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
import { useMessage, useDialog } from 'naive-ui';
import { onMounted, ref } from "@vue/runtime-core";
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { onUpdaterEvent } from "@tauri-apps/api/updater";

const message = useMessage();
const dialog = useDialog();
let show = ref(false)
onMounted(async () => {
  await updateApp()
})
const check = async () => {
  try {
    const { shouldUpdate, manifest } = await checkUpdate()
    if (shouldUpdate) {
      message.info("可更新,最新版为:" + manifest.version)
    } else {
      message.success("当前为最新版本")
    }
  } catch (error) {
    message.error("更新异常:" + error)
  }
}
const updateApp = async () => {
  try {
    //检查是否有可用的更新 返回UpdateResult
    const { shouldUpdate, manifest } = await checkUpdate();
    message.info("当前版本:"+manifest.version);
    if (shouldUpdate) {
      dialog.warning({
        title: '更新',
        content: '是否更新?',
        positiveText: '是',
        negativeText: '否',
        onPositiveClick: async () => {
          show.value = true
          // 如果有可用的更新，请安装更新
          await installUpdate()
          const unlisten = await onUpdaterEvent(async ({ error, status }) => {
            if (status == "PENDING") {
              message.info("下载开始")
            } else if (status == "DONE") {
              message.success("安装完成")
              // 安装完成后重启
              await relaunch()
            } else if (status == "ERROR") {
              message.error("安装失败:" + error);
            }
          });
          unlisten();
        }
      })

    }
  } catch (error) {
    alert("更新异常:" + error)
  }
}
</script>

<style>

</style>
