<!-- TODO: use as bg instead of img tag -->
<template>
  <div>
    <div class="position-relative">
      <!-- TODO: put like button in component, pass gameId -->
      <!-- TODO: if liked, show dropdown when clicked, options: remove from your games -->
      <b-button
        variant="transparent"
        squared
        class="ml-2 mt-1 p-0 position-absolute"
        :disabled="!user"
        @click="$bus.$emit('SELECT_GAME', gameId)"
      >
        <i :class="[isLiked ? 'fa-solid': 'fa-regular' , 'fa-heart text-danger']" />
      </b-button>

      <GameRatings class="position-absolute d-flex" style="bottom: 1rem; right: 1rem;" />
    
      <b-img
        :src="$options.getImageUrl(cachedGame)"
        :alt="gameName"
        class="border d-flex mb-3 w-100"
        :class="`border-${darkTheme ? 'dark' : 'light'}`"
        bordered
        rounded
        @click="flipped = !flipped"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameRatings from '@/components/Game/GameRatings';
import { getImageUrl } from '@/utils';

export default {
  getImageUrl,

  components: {
    GameRatings,
  },

  data() {
    return {
      flipped: false,
    };
  },

  computed: {
    ...mapState(['game', 'cachedGames', 'games', 'user']),
    ...mapGetters(['darkTheme', 'gameNews', 'gameLinks', 'gameGenres']),

    gameId() {
      return this.$route.params.id;
    },

    isLiked() {
      return this.games?.[this.gameId];
    },

    cachedGame() {
      return this.cachedGames?.[Number(this.$route.params.id)] || this.game;
    },

    gameName() {
      return this.cachedGame?.name;
    },
  },
}
</script>

<style scoped>
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  perspective: 1000px;
  width: 100%;
  height: auto;
  background-color: red;
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

</style>
