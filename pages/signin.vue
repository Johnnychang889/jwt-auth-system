<template>
  <div>
    <div>
      <h1>sign in</h1>
    </div>
    <div>
      帳號
      <input type="text" v-model="account">
      <br>
      密碼
      <input type="text" v-model="password">
    </div>
    <div class="container">
      <button class="button" @click="login">登入
      </button>
      <div v-if="pending">
        <img src="/loading.gif" class="loading">
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';
const { auth_client_localstorage, auth_client_cookie, logout } = useAuth();
const { $auth_status } = useNuxtApp()
const router = useRouter();


const account = ref('');
const password = ref('');
const localStorage_token = ref('');
const error = ref(null);
const pending = ref(false);

const login_localstorage = async () => {
  localStorage_token.value = localStorage.getItem('token')
  let user_info = {
    'token': localStorage_token.value,
    'account': account.value,
    'password': password.value
  }
  const auth_result = await auth_client_localstorage(user_info)
  return auth_result
}

const login_cookie = async () => {
  let user_info = {
    'account': account.value,
    'password': password.value
  }
  const auth_result = await auth_client_cookie(user_info)
  return auth_result
}

const login = async () => {
  pending.value = true

  const localStorage_res = await login_localstorage()
  console.log(localStorage_res)
  if (localStorage_res !== '[localstorage]login suceess') {
    //If the token expires or else errors occur, the user will be forced to log out directly
    $auth_status.value = false
    const res = await logout()
    console.log(res)
    pending.value = false
    return
  }

  const cookie_res = await login_cookie()
  console.log(cookie_res)
  if (cookie_res !== '[cookie]login suceess') {
    //If the token expires or else errors occur, the user will be forced to log out directly
    $auth_status.value = false
    const res = await logout()
    console.log(res)
    pending.value = false
    return
  }

  if (localStorage_res === '[localstorage]login suceess' && cookie_res === '[cookie]login suceess') {
    //update global auth status
    const { $auth_status } = useNuxtApp()
    $auth_status.value = true

    console.log('login success')
    router.push('/')
  }

  pending.value = false
}

onMounted(async () => {
  pending.value = true
  if (!localStorage.getItem('token')) {
    pending.value = false
    return
  }
  await login()
  pending.value = false
});

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