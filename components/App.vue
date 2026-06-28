<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { VGlass } from '@daisigu/vue-liquid-glass';

import { tabItems } from '@/lib/tabs';
import { buildPageLink, updateReaderQuery } from '@/lib/route';
import { extensionState, requestThemeChange } from '@/lib/state';
import { saveReadTopicId, saveReaderSplitRatio } from '@/lib/storage';
import type { ThemeSetting, TopicListItem } from '@/lib/types';

const readerUrl = ref(extensionState.readerUrl);
const configOpen = ref(false);
const searchText = ref('');
const workspaceRef = ref<HTMLElement | null>(null);
const isDraggingSplit = ref(false);
const tabPillsRef = ref<HTMLElement | null>(null);
const isDraggingTabs = ref(false);
const tabDragStartX = ref(0);
const tabScrollStartLeft = ref(0);

watch(
  () => extensionState.readerUrl,
  (value) => {
    readerUrl.value = value;
  },
);

const navItems = computed(() => [
  { label: '探索', href: '/' },
  { label: '最近', href: '/recent' },
  { label: '节点', href: '/?tab=nodes' },
  { label: '提醒', href: '/notifications' },
  { label: '我的', href: '/my/topics' },
]);

const rootClasses = computed(() => ({
  origin: !extensionState.route.supported,
}));

const currentTitle = computed(() => {
  if (extensionState.route.node && extensionState.route.nodeText) {
    return extensionState.route.nodeText;
  }
  if (extensionState.route.recent) {
    return '最近更新';
  }
  if (extensionState.route.myTopics) {
    return '我的主题';
  }
  return '探索';
});

const selectedTopicId = computed(() => {
  if (extensionState.route.topicId) {
    return extensionState.route.topicId;
  }

  const matched = extensionState.topics.find((item) => item.url === extensionState.readerUrl);
  return matched?.id ?? null;
});

const filteredTopics = computed(() => {
  const keyword = searchText.value.trim().toLowerCase();
  if (!keyword) {
    return extensionState.topics;
  }

  return extensionState.topics.filter((item) => {
    const haystack = [item.title, item.userName, item.nodeText ?? ''].join(' ').toLowerCase();
    return haystack.includes(keyword);
  });
});

const feedItems = computed(() =>
  filteredTopics.value.map((item) => ({
    ...item,
    isRead: extensionState.readTopicIds.includes(item.id),
    isOwn: extensionState.user.loggedIn && item.userName === extensionState.user.name,
  })),
);

const selectedTopic = computed(() => feedItems.value.find((item) => item.id === selectedTopicId.value) ?? feedItems.value[0] ?? null);
const readerMeta = computed(() => {
  if (!selectedTopic.value) {
    return '';
  }

  return [selectedTopic.value.userName, selectedTopic.value.nodeText, selectedTopic.value.lastReplyText].filter(Boolean).join(' · ');
});
const gridStyle = computed(() => ({
  '--k-reader-ratio': String(extensionState.settings.readerSplitRatio),
}));

const nextPage = computed(() => buildPageLink(extensionState.route, extensionState.route.page + 1));
const previousPage = computed(() => {
  if (extensionState.route.page <= 1) {
    return null;
  }
  return buildPageLink(extensionState.route, extensionState.route.page - 1);
});

const currentNavHref = computed(() => {
  if (extensionState.route.tab === 'nodes') {
    return '/?tab=nodes';
  }
  if (extensionState.route.myTopics) {
    return '/my/topics';
  }
  if (extensionState.route.recent) {
    return '/recent';
  }
  return '/';
});

const openReader = async (item: TopicListItem) => {
  readerUrl.value = item.url;
  extensionState.readerUrl = item.url;
  updateReaderQuery(item.url);
  extensionState.readTopicIds = [item.id, ...extensionState.readTopicIds.filter((topicId) => topicId !== item.id)].slice(0, 600);
  extensionState.readTopicIds = await saveReadTopicId(item.id);
};

const switchTheme = async (theme: ThemeSetting) => {
  configOpen.value = false;
  await requestThemeChange(theme);
};

const clampRatio = (value: number) => Math.min(0.7, Math.max(0.28, value));

const finishResize = async () => {
  if (!isDraggingSplit.value) {
    return;
  }

  isDraggingSplit.value = false;
  window.removeEventListener('pointermove', handleSplitDrag);
  window.removeEventListener('pointerup', finishResize);
  extensionState.settings = await saveReaderSplitRatio(extensionState.settings.readerSplitRatio);
};

const handleSplitDrag = (event: PointerEvent) => {
  if (!workspaceRef.value) {
    return;
  }

  const bounds = workspaceRef.value.getBoundingClientRect();
  const nextRatio = clampRatio((bounds.right - event.clientX) / bounds.width);
  extensionState.settings.readerSplitRatio = nextRatio;
};

const startResize = (event: PointerEvent) => {
  if (window.innerWidth <= 1280) {
    return;
  }

  event.preventDefault();
  isDraggingSplit.value = true;
  window.addEventListener('pointermove', handleSplitDrag);
  window.addEventListener('pointerup', finishResize, { once: true });
};

const stopTabDrag = () => {
  isDraggingTabs.value = false;
  window.removeEventListener('pointermove', handleTabDrag);
  window.removeEventListener('pointerup', stopTabDrag);
};

const handleTabDrag = (event: PointerEvent) => {
  if (!isDraggingTabs.value || !tabPillsRef.value) {
    return;
  }

  const delta = event.clientX - tabDragStartX.value;
  tabPillsRef.value.scrollLeft = tabScrollStartLeft.value - delta;
};

const startTabDrag = (event: PointerEvent) => {
  if (!tabPillsRef.value) {
    return;
  }

  isDraggingTabs.value = true;
  tabDragStartX.value = event.clientX;
  tabScrollStartLeft.value = tabPillsRef.value.scrollLeft;
  window.addEventListener('pointermove', handleTabDrag);
  window.addEventListener('pointerup', stopTabDrag, { once: true });
};

const scrollTabs = (event: WheelEvent) => {
  if (!tabPillsRef.value) {
    return;
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  tabPillsRef.value.scrollLeft += delta;
};

onUnmounted(() => {
  window.removeEventListener('pointermove', handleSplitDrag);
  window.removeEventListener('pointerup', finishResize);
  window.removeEventListener('pointermove', handleTabDrag);
  window.removeEventListener('pointerup', stopTabDrag);
});
</script>

<template>
  <div class="k-shell" :class="rootClasses">
    <aside class="k-sidebar">
      <VGlass class="k-sidebar-glass" :blur="8" :scale="14" :base-frequency="0.012">
        <div class="k-sidebar-search">
          <input v-model="searchText" type="text" placeholder="搜索主题、节点、用户" />
        </div>

        <nav class="k-sidebar-nav">
          <a
            v-for="item in navItems"
            :key="item.href"
            class="k-sidebar-link"
            :class="{ active: item.href === currentNavHref }"
            :href="item.href"
          >
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <button class="k-theme-entry" type="button" @click="configOpen = !configOpen">
          <span>主题</span>
        </button>

        <a v-if="extensionState.user.loggedIn" class="k-sidebar-user" :href="`/member/${extensionState.user.name}`">
          <img :src="extensionState.user.avatar" :alt="extensionState.user.name" />
          <span class="k-sidebar-user-name">{{ extensionState.user.name }}</span>
        </a>
      </VGlass>
    </aside>

    <main v-if="extensionState.route.supported" ref="workspaceRef" class="k-workspace">
      <div class="k-content-grid" :class="{ dragging: isDraggingSplit }" :style="gridStyle">
        <section class="k-feed-column">
          <VGlass class="k-section-glass" :blur="8" :scale="12" :base-frequency="0.011">
            <div class="k-section-head">
              <div class="k-section-head-top">
                <div class="k-section-heading">
                  <h2>{{ currentTitle }}</h2>
                </div>
                <div class="k-section-links">
                  <a v-if="previousPage" :href="previousPage">上一页</a>
                  <a :href="nextPage">下一页</a>
                </div>
              </div>
              <div class="k-section-toolbar">
                <div ref="tabPillsRef" class="k-tab-pills" @wheel.prevent="scrollTabs" @pointerdown="startTabDrag">
                  <a
                    v-for="item in tabItems"
                    :key="item.tab"
                    class="k-pill"
                    :class="{ active: item.tab === extensionState.route.tab }"
                    :href="item.href"
                  >
                    {{ item.label }}
                  </a>
                </div>
              </div>
            </div>

            <ul class="k-feed-list">
              <li v-for="item in feedItems" :key="item.id">
                <button
                  class="k-feed-row"
                  :class="{
                    active: item.id === selectedTopicId,
                    'is-read': item.isRead,
                    'is-own': item.isOwn,
                  }"
                  type="button"
                  @click="openReader(item)"
                >
                  <div class="k-feed-row-main">
                    <div class="k-feed-row-title">
                      <span class="k-feed-row-title-text">{{ item.title }}</span>
                      <span v-if="item.isOwn" class="k-feed-badge">我的</span>
                      <span v-if="!item.isRead" class="k-feed-unread-dot" aria-label="未读" />
                    </div>
                    <div class="k-feed-row-meta">
                      <img :src="item.avatar" :alt="item.userName" />
                      <span>{{ item.userName }}</span>
                      <span v-if="item.nodeText">{{ item.nodeText }}</span>
                      <span v-if="item.lastReplyText">{{ item.lastReplyText }}</span>
                    </div>
                  </div>
                  <span class="k-feed-row-reply">{{ item.reply }}</span>
                </button>
              </li>
            </ul>
          </VGlass>
        </section>

        <div class="k-splitter" role="separator" aria-orientation="vertical" @pointerdown="startResize">
          <span class="k-splitter-handle" />
        </div>

        <aside class="k-reader-column">
          <VGlass class="k-reader-glass" :blur="10" :scale="18" :base-frequency="0.012">
            <div v-if="selectedTopic" class="k-reader-card">
              <div class="k-reader-head">
                <img class="k-reader-avatar" :src="selectedTopic.avatar" :alt="selectedTopic.userName" />
                <div class="k-reader-head-main">
                  <h2>{{ selectedTopic.title }}</h2>
                  <p class="k-reader-meta">{{ readerMeta }}</p>
                </div>
                <a class="k-reader-link" :href="selectedTopic.url" target="_blank" rel="noreferrer">原帖</a>
              </div>

              <div v-if="readerUrl" class="k-reader-frame-shell">
                <iframe class="k-reader-frame" :src="readerUrl" title="V2EX Reader" />
              </div>
            </div>
            <div v-else class="k-reader-empty">
              <p>从左侧内容区选择一个主题后，会在这里展开阅读。</p>
            </div>
          </VGlass>
        </aside>
      </div>
    </main>

    <div v-if="configOpen" class="k-theme-modal">
      <VGlass class="k-theme-glass" :blur="10" :scale="16" :base-frequency="0.012">
        <div class="k-theme-head">
          <div class="k-section-kicker">主题设置</div>
          <h2>切换展示风格</h2>
        </div>
        <div class="k-theme-grid">
          <button class="k-theme-option" type="button" @click="switchTheme('origin')">默认主题</button>
          <button class="k-theme-option" type="button" @click="switchTheme('light')">亮主题</button>
          <button class="k-theme-option" type="button" @click="switchTheme('dark')">暗主题</button>
        </div>
      </VGlass>
    </div>
  </div>
</template>
