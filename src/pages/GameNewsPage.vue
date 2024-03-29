<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        <div class="d-flex align-items-center">
          <b-button
            :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
            :variant="darkTheme ? 'secondary' : 'light'"
            class="mr-2"
            >
              <i class="fa-solid fa-chevron-left" />
          </b-button>

          <h3>News</h3>
        </div>
      </portal>

      <b-spinner v-if="loading" class="spinner-centered" />

      <div v-else-if="!gameNews" class="text-center">
        No news found
      </div>

      <b-row v-else>
        <b-col cols="12" sm="4">
          <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
            <b-img :src="$options.getImageUrl(game)" fluid rounded />
          </router-link>
        </b-col>

        <b-col cols="12" sm="8">
          <b-card
            v-for="article in gameNews"
            class="mb-3"
            :bg-variant="darkTheme ? 'secondary' : 'light'"
            :text-variant="darkTheme ? 'white' : 'dark'"
            :key="article.id"
          >
            <div class="d-flex align-items-start justify-content-between">
              <aside>
                <h2 class="mb-0">
                  {{ article.title }}
                  <b-badge>{{ article.date }}</b-badge>
                </h2>

                <small v-if="article.author" :class="darkTheme ? 'text-light' : 'text-muted'">
                  By {{ article.author }}
                </small>
              </aside>

              <a
                v-if="article.source.url"
                :href="article.source.url"
                :title="article.source.name"
                target="blank"
                class="mb-2 ml-2"
              >
                <b-img
                  class="news-source-logo"
                  :src="`/logos/news-sources/${article.source.img}`"
                />
              </a>
            </div>

            <div class="game-news" v-html="article.contents" />

            <!-- <b-badge v-for="tag in article.tags" :key="tag">{{ tag }}</b-badge> -->
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getImageUrl } from '@/utils';
import { NEWS_SOURCES } from '@/constants';

export default {
  getImageUrl,

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(['game']),
    ...mapGetters(['gameNews', 'darkTheme']),

    steamAppId() {
      const steamUrl = this.game?.websites?.find(({ category }) => category === 13)?.url;

      return steamUrl?.split('/')?.[4];
    },
  },

  mounted() {
    if (this.steamAppId) this.loadNews();
  },

  methods: {
    async loadNews() {
      this.loading = true;

      await this.$store.dispatch('LOAD_STEAM_GAME_NEWS', this.steamAppId);

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.game-news {
  img {
    height: auto;
    margin-bottom: 1rem;
    max-width: 100%;
    border-radius: 4px;
    display: flex;
  }

  iframe {
    max-width: 100%;
  }
}

.news-source-logo {
  width: 40px;
  height: auto;
  max-width: 100%;
}
</style>
