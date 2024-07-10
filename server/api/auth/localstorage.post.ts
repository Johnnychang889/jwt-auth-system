// @ts-ignore
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user_agent = getRequestHeader(event, 'user-agent')
  const ip = getRequestHeader(event, 'x-forwarded-for')
  // Read token from local storage
  const token = getRequestHeader(event, 'Authorization')?.slice(7)

  //key
  const secret = 'my-secret-localstorage';

  const send_token_to_client = () => {
    let accept = false;
    let new_token = null;

    if (body.account === 'a' && body.password === 'a') {
      accept = true

      const payload = {
        'ip': ip,
        'user_agent': user_agent
      };

      new_token = jwt.sign(payload, secret, { expiresIn: '1 day' })
    }

    return {
      'accept': accept,
      'token': new_token
    }
  }

  const client_have_token = () => {
    let accept = false;
    let expired = false;
    let error = false;

    try {
      const decoded = jwt.verify(token, secret);
      if (decoded.ip === ip && decoded.user_agent === user_agent) {
        accept = true
      }
    } catch (e) {
      console.log(e)
      error = true
      if (e instanceof Error) {
        if (e.name === 'TokenExpiredError') {
          expired = true
        }
      }
    }

    return {
      'accept': accept,
      'expired': expired,
      'error': error
    }
  }

  let response = null
  if (token === 'null' || !token) {
    response = send_token_to_client();
  }
  else {
    response = client_have_token();
  }

  console.log('accept: ' + response.accept)
  return response
})

