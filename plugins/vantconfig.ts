import { defineNuxtPlugin } from '#app';
import {Button, Field, CellGroup, Popup, Image as VanImage, Search, List} from 'vant';
import 'vant/lib/index.css';

export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(Button)
    nuxtApp.vueApp.use(Field)
    nuxtApp.vueApp.use(CellGroup)
    nuxtApp.vueApp.use(Popup)
    nuxtApp.vueApp.use(VanImage)
    nuxtApp.vueApp.use(Search)
    nuxtApp.vueApp.use(List)
})