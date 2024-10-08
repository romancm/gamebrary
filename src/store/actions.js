import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  deleteUser,
  signOut,
} from "firebase/auth";

import {
  getStorage,
  ref,
  getDownloadURL,
  listAll,
  getMetadata,
  uploadBytes,
  deleteObject
} from "firebase/storage";

import { FIREBASE_CONFIG } from "@/constants";
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();

const API_BASE = "https://us-central1-gamebrary-8c736.cloudfunctions.net";
// const API_BASE = 'http://localhost:5001/gamebrary-8c736/us-central1';

export default {
  async UPLOAD_PROFILE_AVATAR({ state }, file) {
    const storageRef = ref(storage, `${state.user.uid}/avatars/${file.name}`);
    const uploadedFile = await uploadBytes(storageRef, file);

    return uploadedFile.metadata.fullPath;
  },

  async SAVE_PROFILE({ commit, state }, profile) {
    await setDoc(doc(db, 'profiles', state.user.uid), profile);

    commit("SET_PROFILE", profile);

    return profile;
  },

  async DELETE_PROFILE({ commit, state }) {

    await deleteDoc(doc(db, 'profiles', state.user.uid));

    commit("REMOVE_PROFILE");
  },

  async DELETE_ACCOUNT({ commit, state }) {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await deleteDoc(doc(db, 'games', state.user.uid));
      await deleteDoc(doc(db, 'notes', state.user.uid));
      await deleteDoc(doc(db, 'tags', state.user.uid));
      await deleteDoc(doc(db, 'progresses', state.user.uid));
      await deleteDoc(doc(db, 'profiles', state.user.uid));
      await deleteDoc(doc(db, 'settings', state.user.uid));

      if (state.boards.length > 0) {
        state.boards.forEach(({ id }) => {
          deleteDoc(doc(db, 'boards', id));
        })
      }

      if (state.wallpapers.length > 0) {
        state.wallpapers.forEach(({ fullPath }) => {
          deleteObject(ref(storage, fullPath));
        });
      }

      const avatarsRef = ref(storage, `${state.user.uid}/avatars`);

      listAll(avatarsRef).then(({ items }) => {
        items.forEach(({ fullPath }) => deleteObject(ref(storage, fullPath)));
      });

      await deleteUser(user);

      return commit('CLEAR_SESSION');
    } catch (error) {
      commit('SET_SESSION_EXPIRED', true);
    }
  },

  async SAVE_BOARD({ state }) {
    await setDoc(doc(db, 'boards', state.board.id), { ...state.board, lastUpdated: Date.now() });

    return;
  },

  async SAVE_GAME_BOARD({ commit }, payload) {
    const board = {
      ...payload,
      lastUpdated: Date.now(),
    };

    await setDoc(doc(db, 'boards', board.id), board, { merge: true });

    return commit('SET_GAME_BOARD', board);
  },

  async DELETE_BOARD({ commit }, id) {
    await deleteDoc(doc(db, 'boards', id));

    return commit('REMOVE_BOARD', id);
  },

  async CREATE_BOARD({ state, commit }, board) {
    const docRef = await addDoc(collection(db, "boards"), board);
    const newBoard = { ...board, id: docRef.id };

    commit("ADD_BOARD", newBoard);

    return newBoard;
  },

  async SAVE_NOTES_NO_MERGE({ state }) {
    await setDoc(doc(db, "notes", state.user.uid), state.notes, { merge: false });
  },

  async SIGN_OUT({ commit }) {
    await signOut(auth);
  },

  async LOAD_BOARDS({ state, commit }) {
    const q = query(collection(db, "boards"), where("owner", "==", state.user.uid));

    const querySnapshot = await getDocs(q);
    const boards = querySnapshot.docs.map((doc) => ({
      lastUpdated: 0,
      ...doc.data(),
      id: doc.id,
    }));

    commit("SET_BOARDS", boards || []);
  },

  async LOAD_FIREBASE_IMAGE(context, path) {
    return await getDownloadURL(ref(storage, path));
  },

  async LOAD_USER_PUBLIC_BOARDS(context, userId) {
    const q = query(
      collection(db, "boards"),
      where("owner", "==", userId),
      where("isPublic", "==", true)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs?.map((doc) => doc.data());
  },

  async LOAD_PUBLIC_PROFILE_BY_USERNAME(context, userName) {
    const q = query(collection(db, "profiles"), where("userName", "==", userName));
    const querySnapshot = await getDocs(q);

    const [profile] = querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));

    return profile;
  },

  async LOAD_PROFILES({ commit }) {
    const querySnapshot = await getDocs(query(collection(db, "profiles")));
    const profiles = querySnapshot.docs.map((doc) => doc.data());

    commit("SET_PROFILES", profiles);
  },

  async LOAD_SETTINGS({ commit, state }) {
    const docSnap = await getDoc(doc(db, "settings", state.user.uid));

    commit("SET_SETTINGS", docSnap.data());
  },

  async LOAD_NOTES({ commit, state }) {
    const docSnap = await getDoc(doc(db, "notes", state.user.uid));

    if (docSnap.data()) commit("SET_NOTES", docSnap.data());
  },

  async LOAD_NOTE({ state }, noteId) {
    const docSnap = await getDoc(doc(db, "notes-v2", noteId));

    return docSnap.data();
  },

  async LOAD_TAGS({ commit, state }) {
    const docSnap = await getDoc(doc(db, "tags", state.user.uid));
    const tagsData = docSnap.data();

    if (!tagsData) return;

    const { tags } = docSnap.data();
    const formattedTags = Object.entries(tags).map(([, tag]) => ({ ...tag }));

    commit("SET_TAGS", formattedTags);
  },

  async DELETE_WALLPAPER({ commit }, { fullPath }) {
    await deleteObject(ref(storage, fullPath))

    return commit("REMOVE_WALLPAPER", fullPath);
  },

  async GET_TWITCH_TOKEN({ commit }) {
    const docRef = doc(db, "app", "twitch");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) commit("SET_TWITCH_TOKEN", docSnap.data());
  },

  async LOAD_PUBLIC_BOARDS({ commit }) {
    const querySnapshot = await getDocs(query(collection(db, "boards"), where('isPublic', '==', true)));
    const boards = querySnapshot.docs.map((doc) => doc.data());

    commit("SET_PUBLIC_BOARDS", boards);
  },

  async SAVE_TAGS({ state }) {
    await setDoc(doc(db, "tags", state.user.uid), { tags: state.tags }, { merge: false });
  },

  async SAVE_SETTINGS({ commit, state }, settings) {
    await setDoc(doc(db, "settings", state.user.uid), settings);

    commit("SET_SETTINGS", settings);
  },

  async SAVE_NOTES({ state }) {
    await setDoc(doc(db, "notes", state.user.uid), state.notes, { merge: true });
  },

  // async CREATE_NOTE_V2(context, note) {
  //   const docRef = await addDoc(collection(db, "notes-v2"), note);
  //   // commit("ADD_BOARD", newBoard);
  //   return note;
  // },

  async SAVE_GAMES({ state }) {
    await setDoc(doc(db, "games", state.user.uid), state.games);
  },

  async SAVE_PROGRESSES({ state }) {
    await setDoc(doc(db, "progresses", state.user.uid), state.progresses, { merge: true });
  },

  async SAVE_PROGRESSES_NO_MERGE({ state }) {
    await setDoc(doc(db, "progresses", state.user.uid), state.progresses, { merge: false });
  },

  async LOAD_PROGRESSES({ commit, state }) {
    const docSnap = await getDoc(doc(db, "progresses", state.user.uid));

    commit("SET_PROGRESSES", docSnap.data() || {});
  },

  async LOAD_PROFILE({ commit, state }) {
    const docSnap = await getDoc(doc(db, "profiles", state.user.uid));

    commit("SET_PROFILE", docSnap.data() || {});

    return docSnap.data();
  },

  async LOAD_GAMES({ commit, state }) {
    const docSnap = await getDoc(doc(db, "games", state.user.uid));

    commit("SET_GAMES", docSnap.data() || {});
  },

  async LOAD_BOARD({ state, commit }, id) {
    const docSnap = await getDoc(doc(db, "boards", id));
    const board = docSnap.data();

    const forbiddenTenant = !board?.isPublic && board?.owner !== state?.user?.uid;

    if (forbiddenTenant) {
      throw "Forbidden"
    } else {
      commit("SET_ACTIVE_BOARD", { ...board, id: docSnap.id });

      return { ...board, id: docSnap.id };
    }
  },

  LOAD_WALLPAPERS({ state, commit }) {
    return new Promise((resolve, reject) => {
      const listRef = ref(storage, `${state.user.uid}/wallpapers`);
      const wallpapers = [];

      listAll(listRef).then((res) => {
        if (res.items.length === 0) resolve([]);

        res.items.forEach((itemRef) => {
          getDownloadURL(ref(storage, itemRef.fullPath)).then((url) => {
            getMetadata(itemRef).then((metadata) => {
              wallpapers.push({ url, ...metadata });

              if (wallpapers.length === res.items.length) {
                commit("SET_WALLPAPERS", wallpapers);
                resolve(wallpapers);
              }
            }).catch((error) => {
              reject(error);
            });
          })
        });
      }).catch((e) => {
        reject(e);
      });
    });
  },

  async CHECK_PROFILE_USERNAME_AVAILABILITY(context, userName) {
    const querySnapshot = await getDocs(query(collection(db, "profiles"), where("userName", "==", userName)));

    return querySnapshot?.empty;
  },

  async LOAD_PUBLIC_PROFILE_BY_USER_ID({ commit, state }, userId) {
    const profileDocRef = doc(db, 'profiles', userId);
    const docSnapshot = await getDoc(profileDocRef);

    if (!docSnapshot.exists()) throw new Error('Profile not found');

    return docSnapshot.data();
  },

  async UPLOAD_WALLPAPER({ state, commit }, file) {
    const storageRef = ref(storage, `${state.user.uid}/wallpapers/${file.name}`);
    const { metadata } = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(ref(storage, metadata.fullPath));

    const wallpaper = {
      url: downloadURL,
      ...metadata,
    };

    return commit("ADD_WALLPAPER", wallpaper);
  },

  // EXTERNAL, clean up, use await, etc...
  async GET_SPEEDRUN_GAME_ID({ commit, dispatch }, gameName) {
    try {
      const { data } = await axios.get(`https://www.speedrun.com/api/v1/games?name=${gameName}`);

      console.log('games endpoint response', data);

      const speedRunGameId = data?.data?.[0]?.id;

      if (speedRunGameId) {
        commit("APPEND_GAME_SPEEDRUN_ID", speedRunGameId);
        dispatch("LOAD_GAME_SPEEDRUN_RUNS", speedRunGameId);
        return(speedRunGameId);
      }
    } catch (error) {
      throw error;
    }
  },

  LOAD_GAME_SPEEDRUN_RUNS({ commit }, gameId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://www.speedrun.com/api/v1/runs?game=${gameId}`)
        .then(({ data }) => {
          commit("APPEND_GAME_SPEEDRUNS", data);
          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_FANDOM_DATA({ commit }, { subdomain, pageName }) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://${subdomain}.fandom.com/api.php?action=parse&format=json&page=${pageName}&prop=sections|images`
        )
        .then(({ data }) => {
          // commit('APPEND_GAME_SPEEDRUNS', data);
          resolve(data);
        })
        .catch(reject);
    });
  },

  async CREATE_NEW_CONTACT(context, payload) {
    try {

      const contact = await axios.post("https://api.infusionsoft.com/crm/rest/v1/contacts?fields=addresses,anniversary_date,birth_date,company,contact_type,create_time,custom_fields,email_addresses,fax_numbers,job_title,leadsource_id,links,middle_name,notes,origin,owner_id,phone_numbers,preferred_locale,preferred_name,prefix,referral_code,score_value,social_accounts,source_type,spouse_name,suffix,tag_ids,time_zone,update_time,website", payload, {
        headers: {
          'X-Keap-API-Key': '',
        }
      });

    } catch (error) {

    }
  },

  SUBSCRIBE_TO_NEWSLETTER({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .post("https://forms.keapapis.com/api/v1/public/forms/5330437182324736/submissions")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(reject);
    });
  },

  IGDB({ state, commit }, { path, data, mutation }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_BASE}/igdb?token=${state.twitchToken.access_token}&path=${path}&data=${data}`)
        .then(({ data }) => {
          if (mutation) commit(mutation, data);

          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_WIKIPEDIA_ARTICLE({ commit }, articleTitle) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${articleTitle}`)
        .then(({ data }) => {
          commit("APPEND_WIKIPEDIA_GAME_DATA", data);

          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_WIKIPEDIA_DESCRIPTION(context, articleTitle) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${articleTitle}&prop=extracts&exintro&origin=*`
        )
        .then(({ data }) => {
          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_STEAM_GAME_NEWS({ commit }, steamGameId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_BASE}/steam-news?appId=${steamGameId}`)
        .then(({ data }) => {
          const gameNews = data?.appnews?.newsitems || null;

          commit("APPEND_GAME_NEWS", gameNews);
          resolve(gameNews);
        })
        .catch(reject);
    });
  },

  LOAD_STEAM_GAME({ commit }, steamGameId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_BASE}/steam-game?gameId=${steamGameId}`)
        .then(({ data }) => {
          const steamGameData = data[steamGameId];

          const gameData = steamGameData.success ? steamGameData.data : null;

          commit("APPEND_STEAM_GAME_DATA", gameData);

          resolve(gameData);
        })
        .catch(reject);
    });
  },

  LOAD_IGDB_GAMES({ state, commit }, games) {
    return new Promise((resolve, reject) => {
      const data = `fields id,name,platforms,slug,rating,release_dates.*,name,cover.image_id; where id = (${games}); limit 500;`;

      axios
        .get(`${API_BASE}/igdb?token=${state.twitchToken.access_token}&path=games&data=${data}`)
        .then(({ data }) => {
          commit("CACHE_GAME_DATA", data);
          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_GOG_GAME({ commit }, search) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_BASE}/gog?search=${search}`)
        .then(({ data }) => {
          const gogGame = data?.products?.length > 0 ? data?.products?.[0] : null;

          if (gogGame) commit("APPEND_GOG_GAME_DATA", gogGame);
          resolve();
        })
        .catch(reject);
    });
  },

  SEND_WELCOME_EMAIL(context, additionalUserInfo) {
    return new Promise((resolve, reject) => {
      if (additionalUserInfo?.profile) {
        axios
          .get(`${API_BASE}/email?address=${additionalUserInfo.profile.email}&template_id=welcome`)
          .catch(reject);
      } else {
        reject();
      }
    });
  },

  LOAD_RELEASES({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get("https://api.github.com/repos/romancm/gamebrary/releases")
        .then(({ data }) => {
          console.log('releases', data);
          // const [latestRelease] = data;
          // const latestReleaseVersion = latestRelease && latestRelease.tag_name;
          // const lastReleaseSeenByUser = this.settings?.release || null;
          //
          // if (latestReleaseVersion !== lastReleaseSeenByUser) {
          //   commit('SET_NOTIFICATION', true);
          // }

          commit("SET_RELEASES", data);
          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_GITHUB_REPOSITORY() {
    return new Promise((resolve, reject) => {
      axios
        .get("https://api.github.com/repos/romancm/gamebrary")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(reject);
    });
  },

  LOAD_GITHUB_README() {
    return new Promise((resolve, reject) => {
      axios
        .get("https://raw.githubusercontent.com/romancm/gamebrary/master/README.md")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(reject);
    });
  },
};
