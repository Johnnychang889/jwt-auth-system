export default defineEventHandler(async (event) => {
  setCookie(event, 'token', '', {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 0
  });

  return { message: 'Logout successful!' };
})