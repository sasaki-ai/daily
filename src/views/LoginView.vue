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
            <n-button type="primary" block secondary strong @click="updatemsg">跟新信息</n-button>
            <n-button type="primary" block secondary strong @click="updateins">安装和下载</n-button>
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
import { emit } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
let testupdate = ref()
onMounted(async () => {
 
})
// try {
//   const { shouldUpdate, manifest } = await checkUpdate()
//   console.log("hhhh")
//   if (shouldUpdate) {
//     // display dialog
//     await installUpdate()
//     // install complete, restart app
//     await relaunch()
//   }
// } catch (error) {
//   console.log(error)
// }


const updatemsg = async () => {
  try {
    const { shouldUpdate, manifest } = await checkUpdate()
    console.log("hhhh")
    if (shouldUpdate) {
      // display dialog
      await installUpdate()
      // install complete, restart app
      await relaunch()
    }
  } catch (error) {
    console.log(error)
  }
  console.log("xxxx")
  emit('tauri://update')
  listen('tauri://update-available', function (res) {
    console.log('New version available: ', res)
    alert(res.payload.value);
  })
}

const updateins = () => {
  console.log("yyy")
  emit('tauri://update-install')
  listen('tauri://update-status', function (res) {
    console.log('New status: ', res)
    alert(res);
    if (res.payload.status == "ERROR") {
      alert("error")
    } else if (res == "PENDING") {
      alert("下载开始")
    } else if (res == "DONE") {
      alert("下载完成")
    }
  })
}
//

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