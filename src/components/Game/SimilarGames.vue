<!-- TODO: add pagination, limit to 6 per page -->
<template>
  <div v-if="allGames.length">
    <h3>You may also like</h3>

    <masonry
      v-if="allGames.length"
      gutter="16px"
      :cols="{ default: 3, 1200: 6, 768: 3 }"
    >
      <game-card-search
        v-for="game in allGames"
        :game="game"
        :key="game && game.id"
      />
    </masonry>
  </div>
</template>

<script>
import GameCardSearch from '@/components/GameCards/GameCardSearch';
import { mapState } from 'vuex';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,
  
  components: {
    GameCardSearch,
  },

  computed: {
    ...mapState(['game']),

    allGames() {
      return [
        ...this.parentGame,
        ...this.gameRemakes,
        ...this.collectionGames,
        ...this.gamePorts,
        ...this.gameRemasters,
        ...this.gameBundles,
        ...this.similarGames,
      ];
    },

    gameRemakes() {
      return this.game?.remakes || [];
    },

    collectionGames() {
      const filteredGames = this.game?.collection?.games?.filter(({ id }) => {
        const isCurrentGame = id === this.game?.id;

        return !isCurrentGame;
      })

      return filteredGames || [];
    },

    gamePorts() {
      return this.game?.ports || [];
    },

    gameRemasters() {
      return this.game?.remasters || [];
    },

    similarGames() {
      return this.game?.similar_games || [];
    },

    gameBundles() {
      return this.game?.bundles || [];
    },

    parentGame() {
      return this.game?.parent_game
        ? [this.game?.parent_game]
        : [];
    },
  },

  watch: {
    game(game) {
      this.page = 0;
    },

    gameRemakes(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    similarGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    gameBundles(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    gameRemasters(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },

    collectionGames(games) {
      if (games?.length) this.$store.commit('CACHE_GAME_DATA', games);
    },
  },

  methods: {
    loadMore() {
      this.page++;
    },
  }
};
</script>
