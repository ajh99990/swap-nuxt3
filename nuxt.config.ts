const lifecycle = process.env.npm_lifecycle_event;
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  ssr: false,//不使用服务端渲染能力
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
    ]
  },
  vite: {
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
  css: [
    '@/assets/style/index.less',
  ],
  modules: [
    "@pinia/nuxt",//按照pinia官方文档的用法是放在buildMdules里面就足够了
    '@vueuse/nuxt',//按vueuse文档配置
    "nuxt-windicss",
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
    vueI18n: {
      fallbackLocale: 'zh',
      messages: {
        en: require('./locales/en.json'),
        zh: require('./locales/zh.json')
      }
    }
  },
  experimental: {
    externalVue: true,
  },
  components: true,
});