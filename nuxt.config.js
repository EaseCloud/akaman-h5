export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1'
      },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'reset-css/reset.css',
    '~/assets/styles/style.less'
  ],
  router: {
    mode: 'hash'
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/nuxt-mobile/index',
    '~/plugins/mixins'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-fontawesome'
  ],
  fontawesome: {
    component: 'fa',
    imports: [{
      set: '@fortawesome/free-solid-svg-icons',
      icons: ['fas']
    }]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
}
