<template lang="html">
  <b-container>
    <h2 class="my-2">Boards</h2>

    <div class="boards">
      <b-card
        v-for="board in publicBoards"
        :key="board.id"
        no-body
        :bg-variant="darkTheme ? 'dark' : null"
        :text-variant="darkTheme ?  'white' : null"
        class="overflow-hidden clickable"
        @click="viewBoard(board.id)"
      >
        <mini-board
          :board="board"
          :background-image="getWallpaper(board)"
        />

        <div class="px-2">
          {{ board.name }} by {{ board.owner }}
        </div>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';

export default {
  components: {
    MiniBoard,
  },

  computed: {
    ...mapState(['publicBoards', 'wallpapers']),
    ...mapGetters(['darkTheme']),
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.$store.dispatch('LOAD_PUBIC_BOARDS');
    },

    getWallpaper({ wallpaper }) {
      const boardWallpaper = this.wallpapers.find(({ fullPath }) => fullPath === wallpaper);

      return this.wallpapers.length && boardWallpaper && boardWallpaper.url;
    },

    viewBoard(id) {
      this.$router.push({ name: 'public-board', params: { id } });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.boards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
</style>
