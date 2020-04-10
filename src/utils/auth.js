import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const MenuKey = 'vue_admin_template_menu'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getMenus() {
  return sessionStorage.getItem(MenuKey)
}

export function setMenus(menulist) {
  return sessionStorage.setItem(MenuKey, menulist)
}
export function removeMenus() {
  return sessionStorage.removeItem(MenuKey)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
