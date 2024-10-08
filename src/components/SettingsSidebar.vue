<template lang="html">
  <b-sidebar
    id="settings-sidebar"
    v-bind="sidebarLeftProps"
    z-index="2001"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide" title="Settings" />

      <div class="p-3">
        <b-form-checkbox
          switch
          @change="toggleTheme"
          :checked="darkTheme"
          class="mb-1"
        >
          <span :class="darkTheme ? 'text-light' : null">Dark theme</span>
        </b-form-checkbox>

        <b-form-checkbox
          switch
          @change="toggleGameThumbnails"
          class="mb-1"
          :checked="showGameThumbnails"
        >
          <span :class="darkTheme ? 'text-light' : null">
            Game covers in board preview
          </span>
        </b-form-checkbox>

        <b-form-checkbox
          switch
          @change="toggleTransparency"
          class="mb-1"
          :checked="transparencyEnabled"
        >
          <span :class="darkTheme ? 'text-light' : null">Transparency</span>
        </b-form-checkbox>

        <div class="p-1 mb-1">
          <span :class="darkTheme ? 'text-light' : null">Preferred age rating</span>

          <b-form-select
            :value="ageRating"
            :options="ageRatingOptions"
            @change="setPreferredGameRating"
          />
        </div>

        <div class="p-1 mb-1">
          <span :class="darkTheme ? 'text-light' : null">Menu position</span>

          <b-form-select
            :value="navPosition"
            :options="navPositionOptions"
            @change="setNavPosition"
          />
        </div>

        <DeleteAccountModal />

        <div class="mt-4 d-inline-flex flex-column">
          <b-button
            :variant="darkTheme ? 'dark' : 'light'"
            class="mb-2"
            @click="signOut"
          >
            <i class="fa-regular fa-right-from-bracket fa-fw" />
            Sign out
          </b-button>

          <b-button
            href="https://accounts.google.com/"
            variant="info"
            class="mb-2"
            target="_blank"
          >
            Manage account
          </b-button>

          <b-link
            class="mb-2 text-danger px-3 py-2"
            @click="openDeleteAccountSidebar"
          >
            Delete account
          </b-link>
        </div>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DeleteAccountModal from '@/components/Settings/DeleteAccountModal';
import SidebarHeader from '@/components/SidebarHeader';
import { AGE_RATINGS } from '@/constants';

export default {
  AGE_RATINGS,

  data() {
    return {
      navPositionOptions: [
        { value: 'top', text: 'Top' },
        { value: 'bottom', text: 'Bottom' },
      ],
    };
  },

  components: {
    DeleteAccountModal,
    SidebarHeader,
  },

  computed: {
    ...mapState(['settings']),
    ...mapGetters(['darkTheme', 'showGameThumbnails', 'transparencyEnabled', 'ageRating', 'navPosition', 'sidebarLeftProps']),

    ageRatingOptions() {
      return AGE_RATINGS.map((rating) => ({
          value: rating.id,
          text: rating.name,
        }));
    },
  },

  methods: {
    async setPreferredGameRating(ageRating) {
      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          ageRating,
        });
      } catch (e) {
        this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
      }

      this.saving = false;
    },

    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },

    async signOut() {
			await this.$store.dispatch('SIGN_OUT');
			this.$bvToast.toast('Logged out');
			this.$store.commit('CLEAR_SESSION');
			this.$router.replace({ name: 'home' });
		},

    async toggleGameThumbnails() {
      const { settings } = this;
      const showGameThumbnails = settings?.showGameThumbnails || false;

      const payload = {
        ...settings,
        showGameThumbnails: !showGameThumbnails,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },

    async setNavPosition(navPosition) {
      this.$refs.settingsDropdown?.hide();

      try {
        await this.$store.dispatch('SAVE_SETTINGS', {
          ...this.settings,
          navPosition,
        });
      } catch (e) {
        this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
      }

      this.saving = false;
    },

    async toggleTransparency() {
      const transparencyEnabled = this.settings?.transparencyEnabled || false;

      const payload = {
        ...this.settings,
        transparencyEnabled: !transparencyEnabled,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });
    },

    openDeleteAccountSidebar() {
      this.$root.$emit('bv::toggle::collapse', 'settings-sidebar');
      this.$bvModal.show('delete-account-modal');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
