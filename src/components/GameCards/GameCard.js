// TODO: dissolve
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    list: {
      type: Object,
      default: () => {},
    },
    gameId: [String, Number],
  },

  computed: {
    ...mapState(['settings', 'games', 'tags', 'notes', 'progresses', 'board']),
    ...mapGetters(['gameTags', 'darkTheme']),

    highlightCompletedGame() {
      const { settings } = this.list;

      return settings.highlightCompletedGames
        && this.gameProgress
        && Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return this.gameProgress && Number(this.gameProgress) < 100;
    },

    showGameTags() {
      const { settings } = this.list;

      return settings && settings.showGameTags && this.gameTags;
    },

    gameRating() {
      const { settings } = this.list;

      return settings && settings.showGameRatings && this.game.rating
        ? Math.round((this.game.rating / 20) * 2) / 2
        : false;
    },

    gameProgress() {
      const { gameId, progresses, list: { settings } } = this;

      return settings && settings.showGameProgress && gameId && progresses[gameId]
        ? progresses[gameId]
        : null;
    },

    gameNotes() {
      const { settings } = this.list;

      return settings && settings.showGameNotes && this.notes[this.gameId];
    },

    game() {
      return this.games[this.gameId];
    },

    // TODO: move to utils file
    coverUrl() {
      const game = this.games[this.gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },
  },

  methods: {
    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.gameId });
      this.saveTags();
    },

    async saveTags() {
      await this.$store.dispatch('SAVE_TAGS', this.tags)
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.$bvToast.toast('Tags updated');
    },
  },
};
