import { defineNuxtPlugin } from '#app';
import {Button, Field, CellGroup, Popup, Image as VanImage, Search, List, Icon, Popover, Switch, Slider} from 'vant';
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
    nuxtApp.vueApp.use(Icon)
    nuxtApp.vueApp.use(Popover)
    nuxtApp.vueApp.use(Switch)
    nuxtApp.vueApp.use(Slider)
})