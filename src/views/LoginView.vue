<template>
  <n-spin :show="show">
    <n-grid cols="12" item-responsive>
      <n-grid-item span="12">
        <n-card class="bgLogin" :bordered="false">
          <n-tabs type="line" size="large">
            <n-tab-pane name="用户">
              <n-form ref="loginRef" :model="user" :rules="rules">
                <n-form-item label="用户名" path="username">
                  <n-input v-model:value="user.uname" placeholder="输入用户名" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                  <n-input type="password" v-model:value="user.upwd" placeholder="输入密码" />
                </n-form-item>
              </n-form>
              <n-button type="primary" block secondary strong @click="loginUser">
                登录
              </n-button>
            </n-tab-pane>
            <n-tab-pane name="管理员">
              <n-form ref="loginRef" :model="admin" :rules="rules">
                <n-form-item label="管理员id" path="username">
                  <n-input v-model:value="admin.name" placeholder="输入管理员id" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                  <n-input type="password" v-model:value="admin.password" placeholder="输入密码" />
                </n-form-item>
              </n-form>
              <n-button type="primary" block secondary strong @click="loginAdmin">
                登录
              </n-button>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-spin>
</template>

<script setup>
import { WebviewWindow } from '@tauri-apps/api/window';
import { onMounted, ref } from "@vue/runtime-core";
import { invoke } from "@tauri-apps/api/tauri";
import { adminLogin, userLogin } from '../hooks/login';
import { useMessage, useDialog } from 'naive-ui';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { onUpdaterEvent } from "@tauri-apps/api/updater";
import { fetch,Body } from '@tauri-apps/api/http';

const dialog = useDialog();
let show = ref(false)
const message = useMessage()
let user = ref({
  uname: "",
  upwd: ""
})
let admin = ref({
  name: "",
  password: ""
})
let rules = ref({
  uname: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("需要用户名");
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(value)) {
        return new Error("用户名为必须含英文的6-12位数");
      }
    },
    trigger: ["input", "blur"]
  },
  upwd: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("需要密码");
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(value)) {
        return new Error("密码为必须含英文的8-12位数");
      }
    },
    trigger: "blur"
  }
})

onMounted(async () => {
  await updateApp()
})

const loginUser = async () => {
  // const logindata = await fetch('http://www.redmove.top/login/user', {
  //   method: 'POST',
  //   // 常规的json格式请求体发送
  //   body: Body.json(user.value)
  // });
  let logindata = await userLogin(user.value);
  if (logindata.data.status == 200) {
    message.success("登陆成功");
    localStorage.setItem("token", logindata.data.data.token);
    localStorage.setItem("uid", logindata.data.data.uid);
    const win = WebviewWindow.getByLabel("login");
    win?.hide();
    invoke('open_main');
  } else {
    message.error("账号密码错误");
  }
}

const loginAdmin = async () => {
  let logindata = await adminLogin(admin.value);
  if (logindata.data.status == 200) {
    message.success("登陆成功");
    localStorage.setItem("tokenA", logindata.data.data.tokenA)
    const win = WebviewWindow.getByLabel("login");
    win?.hide();
    invoke('open_admin');
  } else {
    message.error("账号密码错误");
  }
}

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
    message.info("当前版本:" + manifest.version);
    if (shouldUpdate) {
      dialog.warning({
        title: '更新',
        content: '是否更新?',
        positiveText: '是',
        negativeText: '否',
        onPositiveClick: async () => {
          show.value = true;
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
          show.value = false;
        }
      })

    }
  } catch (error) {
    alert("更新异常:" + error)
  }
}
</script>

<style scoped>

</style>