import type { ExtensionSettings, ThemeSetting } from '@/lib/types';

const STORAGE_KEY = 'v2exk:settings';
const READ_TOPICS_KEY = 'v2exk:read-topics';

const defaultSettings: ExtensionSettings = {
  theme: 'origin',
  readerSplitRatio: 0.42,
};

export async function loadSettings(): Promise<ExtensionSettings> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return {
    ...defaultSettings,
    ...(result[STORAGE_KEY] ?? {}),
  };
}

export async function saveTheme(theme: ThemeSetting): Promise<ExtensionSettings> {
  const settings = {
    ...(await loadSettings()),
    theme,
  };
  await browser.storage.local.set({ [STORAGE_KEY]: settings });
  return settings;
}

export async function saveReaderSplitRatio(readerSplitRatio: number): Promise<ExtensionSettings> {
  const settings = {
    ...(await loadSettings()),
    readerSplitRatio,
  };
  await browser.storage.local.set({ [STORAGE_KEY]: settings });
  return settings;
}

export async function loadReadTopicIds(): Promise<string[]> {
  const result = await browser.storage.local.get(READ_TOPICS_KEY);
  const topicIds = result[READ_TOPICS_KEY];

  if (!Array.isArray(topicIds)) {
    return [];
  }

  return topicIds.filter((item): item is string => typeof item === 'string');
}

export async function saveReadTopicId(topicId: string): Promise<string[]> {
  const current = await loadReadTopicIds();
  const next = [topicId, ...current.filter((item) => item !== topicId)].slice(0, 600);
  await browser.storage.local.set({ [READ_TOPICS_KEY]: next });
  return next;
}

export function applyTheme(theme: ThemeSetting): void {
  document.body.classList.remove('k-light', 'k-dark');
  if (theme === 'light') {
    document.body.classList.add('k-light');
  } else if (theme === 'dark') {
    document.body.classList.add('k-dark');
  }
}
