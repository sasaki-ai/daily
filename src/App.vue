<template>
  <n-dialog-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-dialog-provider>
</template>

<script setup>

</script>

<style>
.titlebar {
  background: #329ea3;
}

.titlebar-button {
  padding-right: 5px;
}

.titlebar-button:hover {
  background: #5bbec3;
}

::-webkit-scrollbar {
  width: 0px;
}
</style>
