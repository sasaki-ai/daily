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
                <div ref="offset">
                    <n-space vertical>
                        <n-layout has-sider>
                            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="200"
                                :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                                <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                                    :options="menuOptions" :render-label="renderMenuLabel" />
                            </n-layout-sider>
                            <n-layout>
                                <!--取任账单-->
                                <n-card class="bgLogin" :bordered="false" embedded>
                                    <template #header>
                                        <n-h1 prefix="bar">
                                            <n-text type="primary">
                                                待确认账单
                                            </n-text>
                                        </n-h1>
                                    </template>
                                    <template #header-extra>
                                        <n-space justify="end">
                                            <n-button type="info" @click="addShowBtn">
                                                添加用户
                                            </n-button>
                                            <n-button type="info" @click="refreshBtn">
                                                刷新
                                            </n-button>
                                        </n-space>
        
                                    </template>
                                    <template #default>
                                        <n-transfer ref="transfer" v-model:value="transBills" :options="transOptions"
                                            source-filterable />
                                    </template>
                                    <template #action>
                                        <n-space justify="end">
                                            <n-button type="info" @click="cancelBtn">
                                                否定
                                            </n-button>
                                            <n-button type="info" @click="confirmBtn">
                                                提交
                                            </n-button>
                                        </n-space>
                                    </template>
                                </n-card>
                                <br />
                                <!--所有账单-->
                                <n-card class="bgLogin" :bordered="false" embedded>
                                    <template #header>
                                        <n-h1 prefix="bar">
                                            <n-text type="primary">
                                                所有账单
                                            </n-text>
                                        </n-h1>
                                    </template>
                                    <template #header-extra>
                                        <n-space justify="end">
                                            <n-date-picker v-model:value="range" type="daterange" clearable />
                                            <n-button type="info" @click="searchShowBtn">
                                                搜索
                                            </n-button>
                                            <n-button type="info" @click="summerShowBtn">
                                                总支出
                                            </n-button>
                                        </n-space>
                                    </template>
                                    <template #default>
                                        <n-data-table remote :columns="columns" :data="data" :pagination="pagination" :loading="loading"/>
                                    </template>
                                </n-card>
                            </n-layout>
                        </n-layout>
                    </n-space>
                </div>
            </n-scrollbar>
        </n-grid-item>
    </n-grid>
    <add-user v-model:show="addShow" />
    <summer-log v-model:show="summerShow" />
    <add-bill v-model:show="confirmShow" />
</template>
  
<script setup>
import SummerLog from "../components/SummerLog.vue";
import AddBill from "../components/AddBill.vue";
import AddUser from "../components/AddUser.vue";
import { useMessage,useDialog } from 'naive-ui';
import { onMounted, ref, h } from "@vue/runtime-core";
import { WebviewWindow } from '@tauri-apps/api/window';
import { confirmBills, delBills, getConfirmBills } from "../hooks/admin";
import { search } from "../hooks/user";
import { appWindow } from '@tauri-apps/api/window';

const minimize = () => {
    appWindow.minimize();
}
const maximize = () => {
    appWindow.toggleMaximize();
}
const close = () => {
    dialog.warning({
        title: '警告',
        content: '你确定关闭此程序吗?',
        positiveText: '确定',
        negativeText: '后台运行',
        onPositiveClick: async () => {
            appWindow.close();
        },
        onNegativeClick: () => {
            appWindow.hide();
        }
    })
}

const dialog = useDialog();
let scro = ref()
let offset = ref(null)
const uid = localStorage.getItem("uid");
const message = useMessage()
let transBills = ref([]);
let searchShow = ref(false);
let summerShow = ref(false);
let addShow = ref(false);
let confirmShow = ref(false);
let collapsed = ref(true);
let range = ref([Date.now(), Date.now()]);
let loading = ref(false);
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
    await allBills(page,null);
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

const data = ref([]);

let transOptions = ref([]);

const menuOptions = ref([
    {
        label: "欢迎管理员 #231",
        key: "hear-the-wind-sing",
        href: "https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F/3199"
    }
]);


onMounted(async () => {
    const win = WebviewWindow.getByLabel("login");
    win?.close();
    await cusBills();
    await allBills(1,null);
    scro.value = window.innerHeight - 30;
})

const cusBills = async () => {
    let nobills = await getConfirmBills();
    transOptions.value = Array.apply(null, nobills.data.data).map((target, index) => ({
        label: target.uname + " => [金额:" + target.amount + " 类型:" + target.type + " 日期:" + target.date + "]",
        value: target.bid,
    }));
}

const allBills = async (page,date) => {
    let bills = await search({date: date}, page);
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
const confirmBtn = async () => {
    let bill = await confirmBills(transBills.value);
    if (bill.data.status == 200) {
        await cusBills();
        transBills.value = [];
        message.success('提交成功');
    } else {
        message.success('提交失败');
    }
}
const cancelBtn = async () => {
    let bill = await delBills(transBills.value);
    if (bill.data.status == 200) {
        await cusBills();
        transBills.value = [];
        message.success('提交成功');
    } else {
        message.success('提交失败');
    }
}
const summerShowBtn = () => {
    summerShow.value = true;
}
const searchShowBtn = async () => {
    await allBills(1,range.value);
}
const refreshBtn = async () => {
    await cusBills();
    await allBills(1,null);
    transBills.value = [];
}
</script>
  
<style scoped>

</style>