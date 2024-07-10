export default defineNuxtPlugin((nuxtApp) => {

  return {
    provide: {
      auth_status: ref(false),
      hello: (msg: string) => `Hello ${msg}!`
    }
  }
});