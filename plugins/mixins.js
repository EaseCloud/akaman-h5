import Vue from 'vue'
import components from '@/components'

import { DialogOptions } from '@/nuxt-mobile/plugins/notifier/models'


Vue.mixin({
  components,
  data () {
    return {}
  },
  computed: {
    me () {
      return this.$store.state.auth.me
    },
    choices () {
      return this.$store.state.options.choices
    }
  },
  async mounted () {
    const vm = this
    if (!vm.$store || vm.choices) return
    await vm.$store.dispatch('options/loadOptionChoices')
  },
  methods: {
    async authenticate (reload = false, callSwitch = true) {
      const vm = this
      const isFirstVisit = !vm.me
      if (!reload && vm.me) return vm.me
      const resp = await vm.api('member').get({ action: 'current' })
      vm.$store.commit('auth/setCurrentUser', resp.data)
      if (isFirstVisit && callSwitch) {
        // 这个作为异步的处理，不作等待
        vm.switchUser().then(() => {
          vm.reload && vm.reload()
        })
      }
      return vm.me
    },
    async requireLogin (reload = false, callSwitch = true, backUrl = '') {
      const vm = this
      // 如果有 wechatAuth 的 ticket 参数返回，进行处理
      await vm.dealWechatAuthTicket()
      // 检测现有的的用户登录
      // console.log(callSwitch)
      const user = await vm.authenticate(reload, callSwitch).catch(() => null)
      if (user) return user
      // 跳转向自动的用户登录
      // vm.$router.push('/passport/login')
      vm.redirectWechatAuth(backUrl)
      // 响应 reject 以阻断后续操作
      return Promise.reject()
    },
    redirectWechatAuth (backUrl = '') {
      const vm = this
      const appid = vm.isWechat() ? vm.config.wx_appid_biz : vm.config.wx_appid_web
      // 有时候会跳转去注册或者验证，回来的时候要跳回去
      if (backUrl) localStorage.setItem('__back_url__', backUrl)
      location.href = `${vm.config.wx_api_root}/auth/${appid}/`
    },
    async dealWechatAuthTicket () {
      const vm = this
      const backUrl = localStorage.getItem('__back_url__')
      localStorage.removeItem('__back_url__')
      // 如果返回的 queryString 里面含有 ticket，执行重新的登录
      if (vm.$route.query.ticket) {
        await vm.loginWechat(vm.$route.query.ticket)
        if (backUrl) {
          vm.$router.replace(backUrl)
        } else {
          // 然后刷新页面，去掉 ticket 参数
          const query = vm.$route.query
          delete query.ticket
          delete query.state
          vm.$router.replace({ ...vm.$route, query })
        }
      }
      // 兼容 SPA 模式，如果返回的 ticket 在外面的 query string
      if (/(?:\?|&)ticket=/.test(location.search)) {
        const group = /(?:\?|&)ticket=([^&]+)/.exec(location.search)
        if (!group[1]) return alert(`获取微信登录 ticket 失败：${location.search}`)
        await vm.loginWechat(group[1])
        if (backUrl) {
          vm.$router.replace(backUrl)
        } else {
          location.replace('/' + location.hash)
        }
      }
    },
    async login (username, password, redirectTo = null) {
      const vm = this
      await vm.api('member').post({ action: 'login' }, { username, password })
      await vm.authenticate(true)
      vm.$router.push(redirectTo || { path: '/' })
    },
    async loginWechat (ticket) {
      const vm = this
      const appid = vm.isWechat() ? vm.config.wx_appid_biz : vm.config.wx_appid_web
      return vm.api('member').post({
        action: 'login_with_wechat'
      }, { ticket, appid }).then(() => {
        // 按理来说搞完一次还会在原来的页面，没有必要不要跳回首页了
        // vm.$router.replace('/')
      }, () => {
        vm.notify('微信登录失败')
        // location.href = '/passport/login'
      })
    },
    async logout () {
      const vm = this
      await vm.api('member').post({ action: 'logout' }, {})
      vm.$router.push('/passport/login')
      // vm.requireLogin(true)
    }
  }
})
