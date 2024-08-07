<template lang="html">
  <b-sidebar
    id="wallpaper-details-sidebar"
    scrollable
    right
    width="380px"
    shadow
    :visible="visible"
    no-header
    backdrop
    body-class="px-3 pb-3"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    @hidden="closeSidebar"
  >
    <div
      class="pt-3"
      :class="darkTheme ? 'bg-dark' : 'bg-light'"
    >
      <b-img
        v-if="wallpaperUrl"
        :src="wallpaperUrl"
        class="mw-100 rounded mb-2"
      />

      <div class="d-flex align-items-center justify-content-between pb-2">
        <div>
          <i class="fa-solid fa-file-png fa-fw" />
          {{ activeWallpaper.name }}
          <!-- {{ activeWallpaper.size }} -->
        <!-- {{ activeWallpaper.timeCreated }} -->
        </div>

        <div class="d-flex align-items-center justify-content-between pb-2">
          <b-button
            v-b-toggle.boards-list
            title="Set as wallpaper"
            v-b-tooltip.hover.bottom
          >
            <i class="fa-regular fa-rectangle-list" />
          </b-button>

          <b-button
            v-b-modal.deleteConfirm
            variant="danger"
            class="ml-2"
            v-b-tooltip.hover="{ title: 'Delete wallpaper', placement: 'bottom', boundary: 'viewports' }"
          >
            <i class="fa fa-trash" aria-hidden="true" />
          </b-button>
        </div>
      </div>
    </div>
  
    <b-collapse id="boards-list" class="mt-2">
      <b-alert show style="position: sticky; top: 0; z-index: 3;">Select a board to apply wallpaper</b-alert>

      <MiniBoard
        v-for="board in formattedBoards"
        :key="board.id"
        :board="board"
        @click.native="setAsWallpaper(board)"
      />
    </b-collapse>

    <b-modal
      id="deleteConfirm"
      :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :header-text-variant="darkTheme ? 'white' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :body-text-variant="darkTheme ? 'white' : 'dark'"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Are you sure?"
          @close="close"
        />
      </template>

      <p>Wallpaper will be permanently removed</p>

      <b-alert v-if="boardsWithWallpaper.length" show variant="warning">
        This wallpaper is being used by {{ boardsWithWallpaper.length }} boards.
      </b-alert>

      <b-button @click="deleteFile(activeWallpaper)" variant="danger">
        <b-spinner v-if="deleting" small />
        <template v-else>Delete</template>
      </b-button>
    </b-modal>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';

export default {
  data() {
    return {
      saving: false,
      deleting: false,
    };
  },

  components: {
    MiniBoard,
  },

  computed: {
    ...mapState(['boards', 'wallpapers', 'activeWallpaper']),
    ...mapGetters(['darkTheme']),

    formattedBoards() {
      return this.boards.map((board) => ({ ...board, backgroundUrl: this.getWallpaperUrl(board.backgroundUrl) }));
    },

    wallpaperUrl() {
      return this.activeWallpaper?.url;
    },

    boardsWithWallpaper() {
      return this.boards.filter(({ backgroundUrl }) => backgroundUrl && backgroundUrl === this.activeWallpaper?.fullPath) || [];
    },

    visible() {
      return Boolean(this.activeWallpaper?.fullPath);
    },
  },

  methods: {
    closeSidebar() {
      this.$store.commit('CLEAR_ACTIVE_WALLPAPER');
      this.saving = false;
      this.deleting = false;
    },

    getWallpaperUrl(url) {
      if (!url) return null;
      if (url?.includes('igdb.com')) return url;

      return this.wallpapers?.find(({ ref }) => ref === url)?.url;
    },

    async deleteFile(file) {
      this.deleting = true;

      await this.$store.dispatch('DELETE_WALLPAPER', file)
        .catch(() => {
          this.$bvToast.toast('There was an error deleting wallpaper', { variant: 'danger' });
        });

      this.$bvModal.hide('deleteConfirm');
      this.$root.$emit('bv::toggle::collapse', 'wallpaper-details-sidebar');
    },

    async setAsWallpaper(board) {
      try {
        this.saving = true;

        this.$store.commit('SET_ACTIVE_BOARD', { ...board, backgroundUrl: this.activeWallpaper.fullPath });

        await this.$store.dispatch('SAVE_BOARD');
      } catch (e) {
        this.saving = false;
      }

      // TODO: ask how to proceed, options: 1) go to board 2) Back to wallpapers
      this.$root.$emit('bv::toggle::collapse', 'wallpaper-details-sidebar');
    },
  },
};
</script>
