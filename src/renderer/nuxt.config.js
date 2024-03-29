module.exports = {
  mode: 'universal',
  server: {
    port: 9999
  },
  target: 'server',
  telemetry: false,
  buildDir: 'nuxt-dist',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false,
  dev: process.env.NODE_ENV === 'DEV',
  /*
   ** Global CSS
   */
  css: [
    'lato-font/css/lato-font.css',
    '~/semantic/dist/semantic.min.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~plugins/vue-js-modal'],
  serverMiddleware: [{ path: '/', handler: '~/api/index.js' }],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    'nuxt-element-ui',
    '@nuxtjs/toast',
    'nuxt-i18n'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: { credentials: false, proxyHeaders: false },
  markdownit: {
    injected: true
  },
  toast: {
    position: 'bottom-left',
    duration: 3000
  },
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en-US.js'
      },
      {
        code: 'es',
        iso: 'es-ES',
        name: 'Español',
        file: 'es-ES.js'
      }
    ],
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'i18n/'
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.target = 'electron-renderer'
      }
    }
  }
}
