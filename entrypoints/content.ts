import { createApp } from 'vue';

import App from '@/components/App.vue';
import { extractTopicList, extractUserInfo, resolveInitialReaderUrl } from '@/lib/extractors';
import { enhanceImageLinks } from '@/lib/image-links';
import { installNavigationObserver } from '@/lib/navigation';
import { detectRoute, isManagedPath } from '@/lib/route';
import { extensionState, installThemeHandler } from '@/lib/state';
import { applyTheme, loadReadTopicIds, loadSettings, saveTheme } from '@/lib/storage';
import type { ExtensionSettings, RouteInfo } from '@/lib/types';

import '@/css/theme_light.css';
import '@/css/theme_dark.css';
import '@/styles/app.css';

function createRoot(): HTMLElement {
  const existing = document.getElementById('v2exk-root');
  if (existing) {
    return existing;
  }

  const root = document.createElement('div');
  root.id = 'v2exk-root';
  document.body.appendChild(root);
  return root;
}

function applyLayout(route: RouteInfo): void {
  document.body.classList.toggle('v2exk-managed', route.supported);
  document.body.classList.toggle('v2exk-reader-frame', route.frame && route.topic);
  document.documentElement.classList.remove('v2exk-loading');
}

function onDomReady(): Promise<void> {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
  });
}

function syncState(): void {
  const route = detectRoute();
  const user = extractUserInfo();
  const topics = route.supported ? extractTopicList(route) : [];
  const initialReaderUrl = route.supported ? resolveInitialReaderUrl(route, topics) : '';

  extensionState.route = route;
  extensionState.user = user;
  extensionState.topics = topics;
  extensionState.readerUrl = initialReaderUrl;
  applyLayout(route);
  enhanceImageLinks();
}

export default defineContentScript({
  matches: ['*://v2ex.com/*', '*://*.v2ex.com/*'],
  allFrames: true,
  runAt: 'document_start',
  async main() {
    if (isManagedPath(window.location.pathname) || (window.self !== window.top && window.location.pathname.startsWith('/t/'))) {
      document.documentElement.classList.add('v2exk-loading');
    }

    await onDomReady();

    const settings = await loadSettings();
    const readTopicIds = await loadReadTopicIds();
    applyTheme(settings.theme);
    enhanceImageLinks();

    const initialRoute = detectRoute();
    if (initialRoute.frame && initialRoute.topic) {
      applyLayout(initialRoute);
      return;
    }

    if (!initialRoute.supported) {
      document.documentElement.classList.remove('v2exk-loading');
      return;
    }

    extensionState.route = initialRoute;
    extensionState.settings = settings;
    extensionState.user = extractUserInfo();
    extensionState.topics = extractTopicList(initialRoute);
    extensionState.readTopicIds = readTopicIds;
    extensionState.readerUrl = resolveInitialReaderUrl(extensionState.route, extensionState.topics);

    const root = createRoot();
    applyLayout(extensionState.route);
    installThemeHandler(async (theme: ExtensionSettings['theme']) => {
      extensionState.settings = await saveTheme(theme);
      applyTheme(theme);
    });

    createApp(App).mount(root);

    installNavigationObserver(() => syncState());
  },
});
