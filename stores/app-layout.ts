// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bestari, User } from '~/types'

export const useAppLayoutStore = defineStore('app-layout', () => {
  const bestariLogoPath = '/images/bestari-logo-trasnparent.png'
  const bestariTitlePath = '/images/bestari-transparent.png'
  const chatIconPath = ref('/images/chat-icon.png')
  const chromeApiStore = useChromeApiStore()
  const { getLocalData, setLocalData } = chromeApiStore
  const router = useRouter()
  const drawer = ref<boolean>(false)
  const rail = ref<boolean>(false)
  const tooltipMessage = ref<string>('Open Sidebar')
  const createMessage = ref<string>('Pertanyaan Baru')
  const suggestLink = ref<string>('https://s.id/saran-kritik-bestari-ai')
  const user = ref<User>({
    name: 'John Doe',
    avatar: bestariLogoPath
  })
  const bestari = ref<Bestari>({
    logo: bestariLogoPath,
    title: bestariTitlePath,
  })
  const isDrawerOpen = computed(() => drawer.value)
  const isRailMode = computed(() => rail.value)

  onMounted(() => {
    drawer.value = !!getLocalData(chromeApiStore.storageKeys.drawer_status)
  })

  async function toggleDrawer() {
    drawer.value = !drawer.value
    setLocalData(chromeApiStore.storageKeys.drawer_status, drawer.value)
    // tooltipMessage.value = 'Buka Menu'
    // if (drawer.value) {
    //   rail.value = false
    //   tooltipMessage.value = 'Tutup Menu'
    // }
  }

  function setRail(value: boolean) {
    rail.value = value
  }

  function gotoNewChat() {
    router.push('/')
  }

  return {
    drawer,
    rail,
    user,
    bestari,
    tooltipMessage,
    isDrawerOpen,
    isRailMode,
    createMessage,
    chatIconPath,
    suggestLink,
    toggleDrawer,
    setRail,
    gotoNewChat
  }
})
