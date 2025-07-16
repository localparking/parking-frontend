import Cookies from 'js-cookie'

export const saveTokens = (accessToken: string, refreshToken: string) => {
  // TODO PROD 환경에서 쿠키 설정
  const isProd = import.meta.env.PROD

  // accessToken: 15 분, refreshToken: 7 일
  Cookies.set('town-accessToken', accessToken, {
    path: '/',
    secure: isProd,
    sameSite: 'strict',
    expires: new Date(Date.now() + 15 * 60 * 1000),
  })

  Cookies.set('town-refreshToken', refreshToken, {
    path: '/',
    secure: isProd,
    sameSite: 'strict',
    expires: 7,
  })
}
