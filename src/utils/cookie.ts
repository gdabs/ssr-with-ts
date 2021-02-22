import Cookies, { CookieAttributes } from 'js-cookie';

const TOKEN_KEY = 'X-Litemall-Admin-Token';

class Token {
  /**
   * 存储token
   * @param token 要存储的token值
   * @param otpions cookie的一些其他参数譬如domain和expires等
   */
  setToken(token: string | Object, options?: CookieAttributes) {
    return Cookies.set(TOKEN_KEY, token, { ...options });
  }
  getToken() {
    return Cookies.get(TOKEN_KEY);
  }
  removeToken() {
    return Cookies.remove(TOKEN_KEY);
  }
}

export default new Token();
