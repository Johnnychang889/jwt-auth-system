<template>
  <div>
    <div>
      <div>
        <h1>JWT登入系統 簡單範例</h1>
      </div>
      <div v-if="!$auth_status">
        <div class="container">
          <button class="button" @click="navigate_to_signin">登入</button>
          <div v-if="pending">
            <img src="/loading.gif" class="loading">
          </div>
        </div>
        請先登入
      </div>
      <div v-if="$auth_status">
        <div class="container">
          <button class="button" @click="click_logout">登出</button>
          <div v-if="pending">
            <img src="/loading.gif" class="loading">
          </div>
        </div>
        您已登入
      </div>
      <div v-if="pending">
        <img src="/loading.gif" class="loading">
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';
const { logout } = useAuth();
const { $auth_status } = useNuxtApp()
const router = useRouter();

const pending = ref(false);

function navigate_to_signin() {
  router.push('/signin');
}
async function click_logout() {
  pending.value = true
  $auth_status.value = false
  const res = await logout()
  console.log(res)
  if (res === 'logout suceess') {
    reloadNuxtApp();
    router.push('/')
  }
  pending.value = false
}

onMounted(async () => {
  if (!$auth_status.value) router.push('/signin')
})
</script>

<style scoped>
.button {
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 10px;
  margin-right: 10px;
}

.container {
  display: flex;
  align-items: center;
}

.loading {
  width: 40px;
  height: 40px;
}
</style>