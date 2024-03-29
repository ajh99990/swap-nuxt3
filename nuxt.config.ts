import { defineNuxtConfig } from 'nuxt/config'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineNuxtConfig({
  ssr: false,//不使用服务端渲染能力
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
    ]
  },
  vite: {
    plugins: [
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      })
    ]
   },
  runtimeConfig:{
    public:{
      nodeEnv:process.env.NODE_ENV
    }
  },
  app: {
    head: {
      title: "测试",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "闪兑重构",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' }, 
      { code: 'zh', file: 'zh.json' }
    ],
    langDir:'./locales/',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'zh',
    }
  },
  modules: [
    "@nuxtjs/i18n",
    "@pinia/nuxt",//按照pinia官方文档的用法是放在buildMdules里面就足够了
    '@vueuse/nuxt',//按vueuse文档配置
    "nuxt-windicss",
  ],
  components: true,
});
