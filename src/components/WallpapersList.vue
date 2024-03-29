<template lang="html">
  <section>
    <preview-wallpaper-modal :wallpaper="activeWallpaper" />

    <masonry
      :cols="{ default: 5, 1200: 4, 768: 3, 480: 2 }"
      gutter="16px"
    >
      <b-img
        v-for="wallpaper in sortedWallpapers"
        :key="wallpaper.name"
        :src="wallpaper.url"
        class="mb-3"
        rounded
        fluid
        @click="handleClick(wallpaper)"
      />
    </masonry>
  </section>
</template>

<script>
import sortby from 'lodash.sortby';
import { THUMBNAIL_PREFIX } from '@/constants';
import PreviewWallpaperModal from '@/components/Wallpapers/PreviewWallpaperModal';
import { mapState } from 'vuex';

export default {
  components: {
    PreviewWallpaperModal,
  },

  props: {
    selectable: Boolean,
    selected: String,
    saving: Boolean,
  },

  data() {
    return {
      activeWallpaper: false,
    };
  },

  computed: {
    ...mapState(['wallpapers']),

    sortedWallpapers() {
      const wallpapers = this.wallpapers?.filter((wallpaper) => !wallpaper?.fullPath?.includes(THUMBNAIL_PREFIX));

      return sortby(wallpapers, 'updated').reverse();
    },
  },

  methods: {
    handleClick(wallpaper) {
      if (this.selectable && wallpaper?.fullPath) {
        this.$emit('select', wallpaper.fullPath);
        this.$bvModal.hide('boardWallpaper');
      } else {
        this.openPreview(wallpaper);
      }
    },

    openPreview(wallpaper) {
      this.activeWallpaper = wallpaper;
      this.$bvModal.show('previewWallpaper');
    },
  },
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
.wallpaper-card {
  height: 140px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
