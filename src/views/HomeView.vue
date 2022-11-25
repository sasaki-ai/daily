<template>
  <n-grid cols="12" item-responsive>
    <n-grid-item span="12">
      <n-space justify="end" class="titlebar" data-tauri-drag-region>
        <div class="titlebar-button" id="titlebar-minimize" @click="minimize">
          <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
        </div>
        <div class="titlebar-button" id="titlebar-maximize" @click="maximize">
          <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
        </div>
        <div class="titlebar-button" id="titlebar-close" @click="close">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </n-space>
      <n-scrollbar :style="{maxHeight: scro + 'px'}">
        <n-space vertical>
          <n-layout has-sider>
            <n-layout-sider style="height: 800px" bordered collapse-mode="width" :collapsed-width="64" :width="200"
              :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
              <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
                :render-label="renderMenuLabel" />
            </n-layout-sider>
            <n-layout>
              <n-card class="bgLogin" :bordered="false">
                <n-space justify="end">
                  <n-date-picker v-model:value="range" type="daterange" clearable />
                  <n-button type="info" @click="searchShowBtn">
                    搜索
                  </n-button>
                  <n-button type="info" @click="summerShowBtn">
                    支出
                  </n-button>
                  <n-button type="info" @click="addShowBtn">
                    添加
                  </n-button>
                  <n-button type="info" @click="refreshBtn">
                    刷新
                  </n-button>
                </n-space>
                <n-data-table remote :columns="columns" :data="data" :pagination="pagination" :loading="loading" />
              </n-card>
            </n-layout>
          </n-layout>
        </n-space>
        </n-scrollbar>
    </n-grid-item>
  </n-grid>
  <summer-log v-model:show="summerShow" />
  <add-bill v-model:show="addShow" />
</template>

<script setup>
import SummerLog from "../components/SummerLog.vue";
import AddBill from "../components/AddBill.vue";
import { onMounted, ref, h } from "@vue/runtime-core";
import { WebviewWindow } from '@tauri-apps/api/window';
import { search } from "../hooks/user";
import { appWindow } from '@tauri-apps/api/window'

const minimize = () => {
  appWindow.minimize();
}
const maximize = () => {
  appWindow.toggleMaximize();
}
const close = () => {
  appWindow.hide();
}

let scro = ref()
const uid = localStorage.getItem("uid");
let searchShow = ref(false);
let summerShow = ref(false);
let addShow = ref(false);
let collapsed = ref(true);
let range = ref([118313526e4, Date.now()]);
let loading = ref(false);
let pageHelper = ref(1);
let pagination = ref({
  page: 1,
  pageSize: 4,
  pageCount: 2,
  showQuickJumper: true,
  onChange: async (page) => {
    if (!loading.value) {
      loading.value = true;
    }

    pagination.value.page = page;
    await myBills(page);
    loading.value = false;
  }
})
const columns = ref([
  {
    title: "日期",
    key: "date"
  },
  {
    title: "金额",
    key: "amount"
  },
  {
    title: "类型",
    key: "type"
  }
]);
let data = ref([]);
const menuOptions = ref([
  {
    label: "用户名",
    key: "hear-the-wind-sing",
  }
]);

onMounted(async () => {
  const win = WebviewWindow.getByLabel("login");
  win?.close();
  await myBills(1);
  scro.value = window.innerHeight;
})

const myBills = async (page) => {
  let bills = await search({
    uid: uid,
    date: range.value
  }, page);
  data.value = Array.apply(null, bills.data.data.list).map((target, index) => ({
    date: target.date,
    amount: target.amount,
    type: target.type
  }));
  pagination.value.pageCount = Math.ceil(bills.data.data.total / bills.data.data.pageSize);
}

const renderMenuLabel = (option) => {
  if ("href" in option) {
    return h(
      "a",
      { href: option.href, target: "_blank" },
      option.label
    );
  }
  return option.label;
}

const addShowBtn = () => {
  addShow.value = true;
}
const summerShowBtn = () => {
  summerShow.value = true;
}
const searchShowBtn = async () => {
  await myBills(1);
}
const refreshBtn = async () => {
  await myBills(1);
}
</script>

<style scoped>
.content {
  max-height: 1800px;
}
</style>