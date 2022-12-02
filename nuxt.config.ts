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
  vite:{
  },
  app:{
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
  modules: [
    "@pinia/nuxt",//按照pinia官方文档的用法是放在buildMdules里面就足够了
    '@vueuse/nuxt',//按vueuse文档配置
    "nuxt-windicss",
  ],
  components: true,
});
