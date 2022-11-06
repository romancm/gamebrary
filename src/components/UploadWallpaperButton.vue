<template lang="html">
  <div>
    <b-form-file
      class="d-none file-input"
      v-model="file"
      accept="image/*"
      :browse-text="$t('wallpapers.form.upload')"
      :placeholder="$t('wallpapers.form.placeholder')"
      @input="uploadWallpaper"
    />

    <b-button
      :disabled="outOfSpace"
      variant="light"
      class="mr-2"
      @click="triggerFileUpload"
    >
      <b-spinner small v-if="saving" />

      <template v-else>
        <i class="fas fa-upload fa-fw" aria-hidden />
        <span class="d-none d-sm-inline">Upload</span>
      </template>
    </b-button>

    <b-alert
      v-if="isDuplicate && !saving && file && file.name"
      show
      variant="warning"
    >
      {{ $t('wallpapers.form.duplicateMessage', { fileName: file.name }) }}
    </b-alert>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      maxSpace: '67108864',
      saving: false,
      file: null,
    }
  },

  computed: {
    ...mapState(['wallpapers']),

    isDuplicate() {
      const { file, existingFiles } = this;

      return existingFiles?.includes(file?.name);
    },

    spaceUsed() {
      return this.wallpapers.reduce((total, { metadata }) => {
        const size = metadata?.size || 0;

        return total + size;
      }, 0);
    },

    outOfSpace() {
      return this.spaceUsed >= this.maxSpace;
    },
  },

  methods: {
    triggerFileUpload() {
      document.querySelector('.file-input input').click();
    },

    async uploadWallpaper() {
      if (this.isDuplicate) return this.$bvToast.toast('File already exists', { variant: 'warning' });
      if (!this.file) return false;

      this.saving = true;

      try {
        await this.$store.dispatch('UPLOAD_WALLPAPER', this.file);
      } catch (e) {
        this.$bvToast.toast('There was an error uploading wallpaper', { variant: 'danger' });
      }

      this.file = null;
      this.saving = false;
      this.$bus.$emit('WALLPAPER_UPLOADED');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>