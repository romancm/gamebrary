<template lang="html">
  <b-sidebar
    id="mainMenu"
    shadow
    no-header
    backdrop
    width="380px"
    :visible="menuOpen"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
    @hidden="hideSidebar"
  >
    <template #default>
      <ProfileDockMenu />

      <SearchBox class="m-3" />

      <div class="p-3">
        <b-button
          :variant="routeName === 'boards' ? 'primary' : darkTheme ? 'dark' : 'light'"
          block
          :to="{ name: 'boards' }"
        >
          <i class="fa-regular fa-rectangle-list" />
          <span class="ml-2">Boards</span>
        </b-button>

        <b-button
          :variant="routeName === 'games' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'games' }"
          block
        >
        <i class="fa-regular fa-gamepad fa-fw" />
          Games
        </b-button>

        <!-- TODO: Add progresses page -->
        <b-button
          :variant="darkTheme ? 'dark' : 'light'"
          block
          :to="{ name: 'progresses' }"
          disabled
        >
          <i
            class="fa-solid fa-stopwatch fa-fw"
            aria-hidden="true"
          />
          <span class="ml-2">Progresses</span>
        </b-button>

        <b-button
          block
          :variant="routeName === 'tags' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'tags' }"
        >
          <i class="fa-light fa-tags fa-fw" />
          <span class="ml-2">Tags</span>
        </b-button>

        <b-button
          :to="{ name: 'notes' }"
          :variant="routeName === 'notes' ? 'primary' : darkTheme ? 'dark' : 'light'"
          block
        >
          <i class="fa-regular fa-notes"></i>

          <span class="ml-2">Notes</span>
        </b-button>
        
        <b-button
          :variant="routeName === 'wallpapers' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'wallpapers' }"
          block
        >
        <i class="fa-solid fa-images"></i>
          <span class="ml-2">Wallpapers</span>
        </b-button>

        <b-button
          block
          :variant="routeName === 'settings' ? 'primary' : darkTheme ? 'dark' : 'light'"
          :to="{ name: 'settings' }"
        >
          <i class="fa-regular fa-gear fa-fw" />
          Settings
        </b-button>
      </div>

      <!-- TODO: find place for close button, maybe only needed for mobile? -->
      <!-- <b-button
        @click="hideSidebar"
      >
        <i class="fa-regular fa-xmark"></i>
      </b-button> -->

      <!-- <b-button 
        v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
        :variant="darkTheme ? 'dark' : 'light'"
        title="Home"
        block
        :to="{ name: 'home' }"
      > 
        <img
          src="/logo.png"
          alt=""
          height="26"
        />

        Gamebrary
      </b-button> -->

      
    </template>

    <template #footer>
      <DockFooter />
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ProfileDockMenu from '@/components/Dock/ProfileDockMenu';
import DockFooter from '@/components/Dock/DockFooter';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
    ProfileDockMenu,
    DockFooter,
  },

  computed: {
    ...mapState(['user', 'board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'menuOpen']),
    ...mapGetters(['navPosition', 'latestRelease', 'darkTheme', 'transparencyEnabled']),

    routeName() {
      return this.$route?.name;
    },
  },

  methods: {
    hideSidebar() {
      this.$store.commit('SET_MENU_OPEN', false);
    },
  }
};
</script>
