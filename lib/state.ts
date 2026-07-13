import { reactive } from 'vue';

import type { ExtensionSettings, HotTopicItem, RouteInfo, ThemeSetting, TopicListItem, UserInfo } from '@/lib/types';

interface ExtensionState {
  route: RouteInfo;
  settings: ExtensionSettings;
  user: UserInfo;
  topics: TopicListItem[];
  hotTopics: HotTopicItem[];
  readTopicIds: string[];
  readerUrl: string;
}

const fallbackRoute: RouteInfo = {
  currentUrl: '',
  origin: '',
  pathname: '/',
  page: 1,
  tab: null,
  node: false,
  nodeText: null,
  topic: false,
  recent: false,
  index: false,
  myTopics: false,
  login: false,
  supported: false,
  frame: false,
  topicId: null,
  iframeUrl: null,
};

export const extensionState = reactive<ExtensionState>({
  route: fallbackRoute,
  settings: { theme: 'origin', readerSplitRatio: 0.42 },
  user: {
    loggedIn: false,
    name: '',
    avatar: '',
  },
  topics: [],
  hotTopics: [],
  readTopicIds: [],
  readerUrl: '',
});

let themeHandler: ((theme: ThemeSetting) => Promise<void> | void) | null = null;

export function installThemeHandler(handler: (theme: ThemeSetting) => Promise<void> | void): void {
  themeHandler = handler;
}

export async function requestThemeChange(theme: ThemeSetting): Promise<void> {
  await themeHandler?.(theme);
}
