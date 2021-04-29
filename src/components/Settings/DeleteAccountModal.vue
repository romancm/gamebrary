<template lang="html">
  <b-modal
    id="account-settings"
    hide-footer
    title="Delete account"
  >
    <b-alert show variant="success" v-if="deleting && progress === 5">
      Account deleted
    </b-alert>

    <template v-else-if="deleting">
      {{ message }}
      <b-progress :value="progress" :max="5" class="mb-3"  />
    </template>

    <div v-else>
      The following database entries will be deleted FOREVER.

      <ul>
        <li>User</li>
        <li>Tags</li>
        <li>Notes</li>
        <li>Game Progresses</li>
        <li>Settings</li>
        <li>Boards</li>
        <!-- <li>Wallpapers </li> -->
      </ul>
    </div>

    <b-button
      variant="danger"
      @click="promptDeleteAccount"
      :disabled="deleting"
    >
      Delete Account
    </b-button>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';
import firebase from 'firebase/app';
import sessionMixin from '@/mixins/sessionMixin';

export default {
  mixins: [sessionMixin],

  data() {
    return {
      progress: 0,
      deleting: false,
      message: 'test',
    };
  },

  computed: {
    ...mapState([
      'user',
      'tags',
      'notes',
      'progresses',
      'settings',
      'boards',
      'wallpapers',
    ]),
  },

  methods: {
    promptDeleteAccount() {
      this.$bvModal.msgBoxConfirm('All your data will be removed', {
        title: 'Are you sure you want to delete your account?',
        okVariant: 'danger',
        okTitle: 'Yes, delete account',
      })
        .then((value) => {
          if (value) {
            this.deleteAccount();
          }
        });
    },

    async deleteAccount() {
      this.deleting = true;

      const db = firebase.firestore();
      const user = firebase.auth().currentUser;

      this.message = 'Deleting tags';
      await db.collection('tags').doc(this.user.uid).delete();
      this.progress = this.progress + 1;

      this.message = 'Deleting notes';
      await db.collection('notes').doc(this.user.uid).delete();
      this.progress = this.progress + 1;

      this.message = 'Deleting game progresses';
      await db.collection('progresses').doc(this.user.uid).delete();
      this.progress = this.progress + 1;

      this.message = 'Deleting settings';
      await db.collection('settings').doc(this.user.uid).delete();
      this.progress = this.progress + 1;

      this.message = 'Deleting boards';
      await db.collection('boards').doc(this.user.uid).delete();
      this.progress = this.progress + 1;

      user.delete().then(() => {
        this.$bvToast.toast('Account deleted');

        window.location.href = this.session_publicSiteUrl;

        this.$store.commit('CLEAR_SESSION');
      })
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },
  },
};
</script>