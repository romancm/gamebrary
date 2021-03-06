<template lang="html">
  <div>
    <empty-state
      v-if="showEmptyState"
      :title="$t('wallpapers.title')"
      message="Upload a wallpaper to customize your boards"
      action-text="Upload a wallpaper"
      :busy="saving"
      @action="triggerFileUpload"
    />

    <template v-else>
      <portal to="dock">
        <div class="d-flex justify-content-between align-items-center">
          <div class="space-used d-none d-sm-inline ml-auto mr-3">
            <small
              class="d-block text-center"
              :class="{ 'text-danger': outOfSpace }"
              v-text="usedSpaceText"
            />

            <b-progress
              :value="spaceUsed"
              :max="maxSpace"
              :variant="outOfSpace ? 'danger' : 'success'"
            />
          </div>

          <b-button
            variant="primary"
            :disabled="outOfSpace"
            @click="triggerFileUpload"
          >
            <b-spinner small v-if="saving" />

            <template v-else>
              <i class="fas fa-upload fa-fw" aria-hidden />
              <span>Upload</span>
            </template>
          </b-button>
        </div>
      </portal>

      <b-alert
        v-if="isDuplicate && !saving && file && file.name"
        show
        dismissible
        variant="warning"
      >
        {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
      </b-alert>

      <wallpapers-list v-if="wallpapers.length" />

      <b-alert show v-else>You don't have any wallpapers.</b-alert>
    </template>

    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EmptyState from '@/components/EmptyState';
import { bytesToSize } from '@/utils';
import WallpapersList from '@/components/WallpapersList';

export default {
  components: {
    EmptyState,
    WallpapersList,
  },

  data() {
    return {
      file: null,
      saving: false,
      loading: false,
      isPaid: true,
      maxSpace: '67108864', // 64mb storage limit
      wallpaperUrls: [],
    };
  },

  computed: {
    ...mapState(['user', 'board', 'wallpapers']),
    ...mapGetters(['darkTheme']),

    usedSpaceText() {
      return `${this.formattedSpaceUsed} of ${bytesToSize(this.maxSpace)} used`;
    },

    existingFiles() {
      return this.wallpapers.map(({ name }) => name);
    },

    showEmptyState() {
      return this.wallpapers.length === 0;
    },

    isDuplicate() {
      const { file, existingFiles } = this;

      return file && file.name && existingFiles.includes(file.name);
    },

    formattedSpaceUsed() {
      return this.spaceUsed
        ? bytesToSize(this.spaceUsed)
        : 0;
    },

    spaceUsed() {
      return this.wallpapers.reduce((total, file) => total + file.metadata.size || 0, 0);
    },

    outOfSpace() {
      return this.spaceUsed >= this.maxSpace;
    },
  },

  methods: {
    triggerFileUpload() {
      document.querySelector('.file-input input').click();
    },

    uploadWallpaper() {
      if (this.isDuplicate) {
        return this.$bvToast.toast('File already exists', { variant: 'warning' });
      }

      if (!this.file) {
        return false;
      }

      this.saving = true;

      return this.$store.dispatch('UPLOAD_WALLPAPER', this.file)
        .then(() => {
          this.$bvToast.toast('File uploaded');
          this.file = null;
          this.saving = false;
          this.$bus.$emit('WALLPAPER_UPLOADED');
        })
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.space-used {
  width: 120px;
}
</style>
