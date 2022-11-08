<template>
  <n-grid cols="12" item-responsive>
    <n-grid-item span="12">
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
              </n-space>
              <n-data-table remote :columns="columns" :data="data" :pagination="pagination" :loading="loading" />
            </n-card>
          </n-layout>
        </n-layout>
      </n-space>
    </n-grid-item>
  </n-grid>
  <summer-log v-model:show="summerShow" />
  <add-bill v-model:show="addShow" />
</template>

<script setup>
import SearchBill from "../components/SearchBill.vue";
import SummerLog from "../components/SummerLog.vue";
import AddBill from "../components/AddBill.vue";
import { onMounted, ref, h } from "@vue/runtime-core";
import { WebviewWindow } from '@tauri-apps/api/window';
import { search } from "../hooks/user";

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
    href: "https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F/3199"
  }
]);

onMounted(async () => {
  const win = WebviewWindow.getByLabel("login");
  win?.close();
  await myBills(1);
})
const myBills = async (page) => {
  let bills = await search({
    uid: uid,
    date: range.value
  }, page);
  console.log(bills)
  console.log(range.value)
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
</script>

<style scoped>
.content {
  max-height: 1800px;
}
</style>