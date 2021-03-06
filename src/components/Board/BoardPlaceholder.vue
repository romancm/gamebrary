<template lang="html">
  <div class="gameboard-placeholder" v-if="placeholderBoard && placeholderBoard.lists">
    <div
      v-for="list in placeholderBoard.lists"
      :class="`list ${list.settings.view || 'single'}`"
      :key="list.name"
    >
    <b-card
      no-body
      :bg-variant="darkTheme ? 'dark' : null"
      :text-variant="darkTheme ? 'white' : null"
    >
      <b-card-header class="pt-2 pb-1 px-2">
        <b-skeleton />
      </b-card-header>

      <div
        v-if="list.games.length"
        :class="['games', list.settings.view]"
      >
        <div v-for="n in list.games.length" :key="n">
          <b-card
            no-body
            img-top
            :bg-variant="darkTheme ? 'dark' : null"
            :text-variant="darkTheme ? 'white' : null"
            v-if="list.settings.view === 'grid'"
          >
            <b-skeleton-img
              card-img="top"
              height="180px"
            />

            <b-card-body class="p-2">
              <b-skeleton class="mt-2" />
            </b-card-body>
          </b-card>

          <div
            v-else-if="list.settings.view === 'covers'"
            class="covers-grid"
          >
            <b-skeleton-img
              v-for="n in 3"
              :key="n"
              height="120px"
            />
          </div>

          <b-card
            v-else-if="!list.settings.view || list.settings.view === 'single'"
            no-body
            :bg-variant="darkTheme ? 'dark' : null"
            :text-variant="darkTheme ? 'white' : null"
            img-left
          >
            <b-skeleton-img
              card-img="left"
              width="94px"
              height="124px"
            />

            <b-card-body class="p-2">
              <b-skeleton />
            </b-card-body>
          </b-card>

          <b-card
            :bg-variant="darkTheme ? 'dark' : null"
            :text-variant="darkTheme ? 'white' : null"
            v-else-if="list.settings.view === 'compact'"
            no-body
            img-left
          >
            <b-skeleton-img
              card-img="left"
              width="70px"
              height="93px"
            />

            <b-card-body class="p-2">
              <b-skeleton />
            </b-card-body>
          </b-card>

          <b-card
            v-else-if="list.settings.view === 'text'"
            :bg-variant="darkTheme ? 'dark' : null"
            :text-variant="darkTheme ? 'white' : null"
            no-body
            img-left
          >
            <b-card-body class="p-2">
              <b-skeleton />
            </b-card-body>
          </b-card>
        </div>
      </div>

      <b-button
        v-else
        variant="light"
        block
        class="mb-2"
        disabled
      >
        Click here or drag games here
      </b-button>
    </b-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      placeholderBoard: {},
    };
  },

  computed: {
    ...mapState(['boards']),
    ...mapGetters(['darkTheme']),
  },

  mounted() {
    const boardId = this.$route.params.id;

    this.placeholderBoard = this.boards.find(({ id }) => id === boardId);
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .gameboard-placeholder {
    user-select: none;
    display: flex;
    align-items: flex-start;
  }

  .list {
    flex-shrink: 0;
    cursor: default;
    border-radius: var(--border-radius);
    background: var(--list-background);
    overflow: hidden;
    position: relative;
    width: 300px;
    margin-right: .5rem;
    max-height: calc(100vh - 81px);
  }

  .header {
    margin: 6px 0;
  }

  .games {
    display: grid;
    grid-gap: .5rem;
    padding: .5rem;

    &.grid {
      padding-top: .5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: .25rem;
    }
  }

  .covers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: .5rem;
  }
</style>
