<template>
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
            <h1>跟新内容</h1>
            <n-button type="primary" block secondary strong @click="updateapp">跟新</n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { WebviewWindow } from '@tauri-apps/api/window';
import { onMounted, ref } from "@vue/runtime-core";
import { invoke } from "@tauri-apps/api/tauri";
import { adminLogin, userLogin } from '../hooks/login';
import { useMessage } from 'naive-ui';
//
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { onUpdaterEvent } from "@tauri-apps/api/updater";

const updateapp = async () => {
  try {
    //检查是否有可用的更新 返回UpdateResult
    const { shouldUpdate, manifest } = await checkUpdate()
    console.log(shouldUpdate);
    alert(shouldUpdate)
    console.log(manifest);
    if (shouldUpdate) {
      console.log(`Installing update ${manifest.version}, ${manifest.date}, ${manifest.body}`);
      alert(manifest.version)
      // 如果有可用的更新，请安装更新
      await installUpdate()
      alert("等待更新")
      const unlisten = await onUpdaterEvent(({ error, status }) => {
        console.log('Updater event', error, status);
        alert(error)
        alert(status)
      });
      // install complete, restart app
      await relaunch()
      unlisten()
    }
  } catch (error) {
    console.log(error)
  }
}

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

const loginUser = async () => {
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

</script>

<style scoped>

</style>