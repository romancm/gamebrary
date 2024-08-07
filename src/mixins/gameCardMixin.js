
// TODO: remove this mixin
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL, PLATFORMS } from '@/constants';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

  props: {
    listIndex: Number,
    list: {
      type: Object,
      default: () => {},
    },
    gameId: [String, Number],
  },

  computed: {
    ...mapState(['settings', 'cachedGames', 'tags', 'notes', 'progresses', 'board']),
    ...mapGetters(['isRTL', 'darkTheme']),

    gamePlatforms() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]);
    },

    gamePlatformsText() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
    },

    gameCompleted() {
      return this.list?.highlightCompletedGames && Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return this.list?.showGameProgress && this.gameProgress > 0;
    },

    showReleaseDates() {
      return this.list?.showReleaseDates;
    },

    gameProgress() {
      const { gameId, progresses } = this;

      return gameId && progresses[gameId]
        ? progresses[gameId]
        : 0;
    },

    tagsApplied() {
      const tags = this.tags?.tags || this.tags;

      return tags?.filter((tag) => tag?.games?.includes(this.game?.id)) || [];
    },

    gameNotes() {
      return this.list?.showGameNotes && this.notes?.[this.gameId];
    },

    game() {
      return this.cachedGames[this.gameId];
    },
  },
};
