// import { PLATFORM_FILTER_FIELDS } from '@/constants';
import { AGE_RATING_SYSTEMS } from '@/constants';
import orderby from 'lodash.orderby';

export default {
  sortedBoards: ({ boards }) => orderby(boards, 'name'),
  activeGameCoverUrl: ({ activeGame, games }) => {
    const gameId = activeGame && activeGame.gameId;
    const game = games[gameId];
    const hasImageId = game && game.cover && game.cover.image_id;

    return hasImageId
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`
      : '/static/no-image.jpg';
  },

  isBoardOwner: ({ board, user }) => {
    const boardOwner = board && board.owner;
    const userId = user && user.uid;

    return boardOwner === userId;
  },

  // Arabic is the only ltr language supported at the moment
  isRTL: ({ settings }) => settings && settings.language !== 'ar',

  isPro: ({ user }) => user.isPaid || process.env.NODE_ENV === 'development',

  platformNames: (state) => {
    const formattedPlatforms = {};

    if (!state.platforms) {
      return [];
    }

    state.platforms.forEach(({ id, slug, logoFormat, name }) => {
      formattedPlatforms[id] = {
        name,
        slug,
        logoFormat,
      };
    });

    return formattedPlatforms;
  },

  gameAgeRatings: () => (game) => {
    const ageRatings = game && game.age_ratings;

    if (!ageRatings) return null;

    return ageRatings.map(({ category, rating }) => {
      const { name, ratings } = AGE_RATING_SYSTEMS.find(({ id }) => id === category);

      return { name, rating: ratings[rating] };
    });
  },

  gameTags: state => Object.keys(state.tags) && Object.keys(state.tags).length > 0,
};
