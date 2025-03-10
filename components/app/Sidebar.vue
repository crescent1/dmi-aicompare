<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    class="border-0 bg-grey-lighten-5"
  >
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
      title="John Leider"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
      <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  
  <!-- <v-navigation-drawer
    v-model="drawer"
    class="border-0 bg-grey-lighten-5"
    width="250"
    temporary
  >
    <v-list-item class="mb-5">
      <div class="d-flex align-center">
        logo
      </div>
    </v-list-item>

    <v-list> -->
      <!-- <v-list-item
        rounded="sm"
        class="mb-2 custom-list-item"
        color="green-darken-2"
        :title="createMessage"
        to="/"
        v-tooltip="createMessage"
      >
        <template v-slot:prepend>
          <v-icon class="">mdi-loupe</v-icon>
        </template>
      </v-list-item> -->


      <!-- <v-divider
        color="green-darken-2"
      />

      <v-list-subheader class="text-grey-darken-1 font-weight-medium">
        Riwayat Pertanyaan
      </v-list-subheader> -->

      <!-- <v-list-item
        v-for="item in chromeApiStore.items"
        :key="item.id"
        :title="item.title"
        color="green-darken-2"
        :to="'/chat/' + item.id"
        link
        class="mb-1"
        @click="handleItemClick"
      >
        <template #prepend>
          <v-icon class="">mdi-comment-account</v-icon>
        </template>

        <template #append>
          <div @click.prevent.stop>
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  v-bind="props"
                  @click.prevent.stop
                />
              </template>
              <v-card min-width="200">
                <v-list>
                  <v-list-item
                    prepend-icon="mdi-pencil"
                    title="Rename"
                    density="compact"
                    @click="handleRename(item)"
                  />
                  <v-list-item
                    prepend-icon="mdi-delete"
                    title="Delete"
                    color="error"
                    density="compact"
                    @click="handleDelete(item)"
                  >
                    <template #title>
                      <span class="text-error">Delete</span>
                    </template>
                    <template #prepend>
                      <v-icon color="error">
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </template>
      </v-list-item> -->
    <!-- </v-list> -->

    <!-- Bottom Section -->
    <!-- <template #append> -->
      <!-- <v-list>
        <v-list-item
          prepend-icon="mdi-help-circle"
          title="Bantuan"
          :href="suggestLink"
          target="_blank"
          rel="noopener noreferrer"
        />
      </v-list> -->
    <!-- </template>
  </v-navigation-drawer> -->

  <!-- Delete Confirmation Modal -->
  <!-- <v-dialog
    v-model="showDeleteModal"
    max-width="400"
  >
    <v-card class="pa-4">
      <v-card-title>
        Delete Chat
      </v-card-title>

      <v-card-text>
        Are you sure you want to delete this chat? This action cannot be undone.
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="showDeleteModal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          @click="confirmDelete"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <!-- Rename Dialog -->
  <!-- <v-dialog
    v-model="showRenameDialog"
    max-width="400"
  >
    <v-card>
      <v-card-title>
        Rename Chat
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newTitle"
          label="Chat Name"
          variant="outlined"
          @keyup.enter="confirmRename"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="showRenameDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          :disabled="!newTitle.trim()"
          @click="confirmRename"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>

<script lang="ts" setup>
import type { Item, RouteParams } from '~/types'

const chromeApiStore = useChromeApiStore()
const { setRail } = useAppLayoutStore()
const { fetchItems, deleteItem, updateItem, sanitizeForIndexedDB } = chromeApiStore
const { drawer, rail, chatIconPath, createMessage, suggestLink } = storeToRefs(useAppLayoutStore())
const route = useRoute()
const router = useRouter()
const showDeleteModal = ref(false)
const itemToDelete = ref<Item>()
const showRenameDialog = ref(false)
const newTitle = ref('')
const itemToRename = ref<Item>()

onBeforeMount(async () => {
  await fetchItems()
})

const handleItemClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.closest('.v-btn')) {
    event.preventDefault()
  }
}

const handleDelete = (item: Item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  const itemId = itemToDelete.value?.id
  await deleteItem(itemId as string)

  if ((route.params as unknown as RouteParams).id === itemId) {
    router.push('/')
  }

  showDeleteModal.value = false
  itemToDelete.value = undefined
}

const handleRename = (item: Item) => {
  itemToRename.value = item
  newTitle.value = item.title
  showRenameDialog.value = true
}

const confirmRename = async () => {
  if (newTitle.value.trim() && itemToRename.value) {
    // Perform rename operation here
    itemToRename.value.title = newTitle.value
    const editedItem = await sanitizeForIndexedDB(itemToRename.value)
    await updateItem(editedItem)
    showRenameDialog.value = false
    itemToRename.value = undefined
    newTitle.value = ''
  }
}
</script>

<style scoped>
.v-navigation-drawer {
  padding: 8px;
  top: 0 !important;
}

.custom-icon {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transition: transform 0.2s ease;
}

.custom-list-item:hover .custom-icon {
  transform: scale(1.1);
}
</style>