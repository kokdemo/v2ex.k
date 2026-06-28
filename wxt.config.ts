import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'v2ex.k',
    description: 'V2EX UI enhancement extension',
    permissions: ['storage'],
    host_permissions: ['*://v2ex.com/*', '*://*.v2ex.com/*'],
    icons: {
      '16': 'icon.png',
      '48': 'icon.png',
      '128': 'icon.png',
    },
  },
});
