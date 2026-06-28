export type ThemeSetting = 'origin' | 'light' | 'dark';

export interface ExtensionSettings {
  theme: ThemeSetting;
  readerSplitRatio: number;
}

export interface RouteInfo {
  currentUrl: string;
  origin: string;
  pathname: string;
  page: number;
  tab: string | null;
  node: boolean;
  nodeText: string | null;
  topic: boolean;
  recent: boolean;
  index: boolean;
  myTopics: boolean;
  login: boolean;
  supported: boolean;
  frame: boolean;
  topicId: string | null;
  iframeUrl: string | null;
}

export interface UserInfo {
  loggedIn: boolean;
  name: string;
  avatar: string;
}

export interface TopicListItem {
  id: string;
  url: string;
  title: string;
  avatar: string;
  userUrl: string;
  userName: string;
  nodeUrl: string | null;
  nodeText: string | null;
  reply: number;
  lastReplyText: string | null;
  lastReplyAt: string | null;
  lastReplyBy: string | null;
}

export interface TopicReaderState {
  selectedUrl: string;
  selectedTopicId: string | null;
}
