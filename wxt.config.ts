import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'v2ex.k',
    description: 'V2EX UI enhancement extension',
    permissions: ['storage'],
    host_permissions: ['*://v2ex.com/*', '*://*.v2ex.com/*'],
    icons: {
      '16': 'icon-16.png',
      '48': 'icon-48.png',
      '128': 'icon-128.png',
    },
  },
});
