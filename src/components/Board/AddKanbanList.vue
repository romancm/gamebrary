<template lang="html">
  <div class="flex-shrink-0 pr-4">
    <b-card
      v-if="active || empty"
      class="mr-3"
      :bg-variant="darkTheme ? 'dark' : 'light'"
      :text-variant="darkTheme ? 'light' : 'dark'"
      no-body
      v-click-outside="reset"
    >
      <form
        ref="addListForm"
        class="p-2"
        @submit.stop.prevent="submit"
      >
        <b-input-group>
          <b-form-input
            id="listName"
            autofocus
            placeholder="List name"
            v-model="listName"
            required
          />

          <b-input-group-append>
            <b-button
              split
              variant="primary"
              :disabled="saving || !listName"
              @click.stop="submit"
            >
              <b-spinner v-if="saving" small />
              <span v-else>Add</span>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </form>
    </b-card>

    <b-button
      v-else
      :variant="darkTheme ? 'dark' : 'light'"
      @click.stop="showForm"
      class="mr-2"
    >
      <i class="fas fa-plus" aria-hidden />
    </b-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    empty: Boolean,
  },

  data() {
    return {
      listName: '',
      active: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['platform', 'board']),
    ...mapGetters(['darkTheme']),
  },

  methods: {
    reset() {
      this.listName = '';
      this.active = false;
    },

    showForm() {
      this.active = true;

      this.scroll();
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.addListForm.checkValidity()) {
        this.addList();
      }
    },

    async addList() {
      const list = {
        games: [],
        name: this.listName,
        settings: {},
      };

      this.saving = true;

      this.$store.commit('ADD_LIST', list);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('Error adding list', { variant: 'danger' });
        });

      this.$forceUpdate();
      this.saving = false;
      this.reset();
      this.scroll();
    },

    scroll() {
      this.$nextTick(() => {
        const board = document.querySelector('.viewport');

        board.scrollLeft = board.scrollWidth;
      });
    },
  },
};
</script>
