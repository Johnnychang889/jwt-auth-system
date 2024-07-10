export const useAuth = () => {

  const auth_client_localstorage = async (user_info) => {
    let token = user_info.token;
    let account = user_info.account;
    let password = user_info.password;

    let res = null
    try {
      res = await $fetch('/api/auth/localstorage', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'account': account,
          'password': password
        })
      })
    } catch (e) {
      return '[localstorage]' + e.toString();
    }

    if (!res) {
      return '[localstorage]ERROR: response is empty'
    }
    if (res.expired === true) {
      return '[localstorage]ERROR: jwt expired'
    }
    if (res.error === true) {
      return '[localstorage]ERROR: refresh client token'
    }
    if (res.accept !== true) {
      return '[localstorage]ERROR: Authentication failed'
    }
    if (res.accept === true) {
      if (res.token) localStorage.setItem('token', res.token);
      return '[localstorage]login suceess'
    }
    return '[localstorage]unknown error'
  }

  const auth_client_cookie = async (user_info) => {
    //There is no need to read the cookie here. Getting cookie is handled by the backend
    let account = user_info.account;
    let password = user_info.password;

    let res = null
    try {
      res = await $fetch('/api/auth/cookie', {
        method: 'POST',
        headers: {
          //There is no need to pass cookies here
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'account': account,
          'password': password
        })
      })
    } catch (e) {
      return '[cookie]' + e.toString();
    }
    if (!res) {
      return '[cookie]ERROR: response is empty'
    }
    if (res.expired === true) {
      return '[cookie]ERROR: jwt expired'
    }
    if (res.error === true) {
      return '[cookie]ERROR: refresh client token'
    }
    if (res.accept !== true) {
      return '[cookie]ERROR: Authentication failed'
    }
    if (res.accept === true) {
      //You don’t need to do anything here, setting cookie is handled by the backend
      return '[cookie]login suceess'
    }
    return '[cookie]unknown error'
  }

  const logout = async () => {
    localStorage.removeItem('token');

    let res = null
    try {
      res = await $fetch('/api/auth/logout')
    } catch (e) {
      return '[logout]' + e.toString();
    }
    if (!res) {
      return '[logout]ERROR: response is empty'
    }
    if (res.message !== 'Logout successful!') {
      return '[logout]ERROR: logout abnormal'
    }
    if (res.message === 'Logout successful!') {
      return '[logout]logout suceess'
    }
    return '[logout]unknown error'
  }

  return {
    auth_client_localstorage,
    auth_client_cookie,
    logout
  };
};