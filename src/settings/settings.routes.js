const routes = [
  {
    name: 'account',
    path: '/account',
    component: () => import(/* webpackChunkName: "settings" */ '@/settings/pages/AccountPage'),
    meta: {
      title: 'Account',
    },
  },
  {
    name: 'steam',
    path: '/steam',
    component: () => import(/* webpackChunkName: "settings" */ '@/settings/pages/SteamSettingsPage'),
    meta: {
      title: "Steam",
    },
  },
  {
    name: 'wallpapers',
    path: '/wallpapers',
    component: () => import(/* webpackChunkName: "settings" */ '@/settings/pages/WallpapersPage'),
    meta: {
      title: 'Wallpapers',
      public: true,
    },
  },
];

export default routes;
