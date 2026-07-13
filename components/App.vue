<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { VGlass } from '@daisigu/vue-liquid-glass';

import { tabItems } from '@/lib/tabs';
import { buildPageLink, updateReaderQuery } from '@/lib/route';
import { extensionState, requestThemeChange } from '@/lib/state';
import { saveReadTopicId, saveReaderSplitRatio } from '@/lib/storage';
import type { HotTopicItem, ThemeSetting, TopicListItem } from '@/lib/types';

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
  { label: '我的主题', href: '/my/topics' },
]);

const primaryTabs = computed(() => [
  { label: '全部', href: '/' as const, key: 'all' as const },
  { label: '最近', href: '/recent' as const, key: 'recent' as const },
  { label: '热议', href: '/?tab=hot' as const, key: 'hot' as const },
]);

const quickActions = computed(() => {
  if (!extensionState.user.loggedIn) {
    return [];
  }

  return [
    { label: '创建新主题', href: '/new', active: false },
    { label: '领取登录奖励', href: '/mission/daily', active: false },
  ];
});

const userLinks = computed(() => {
  if (!extensionState.user.loggedIn) {
    return [];
  }

  return [
    { label: '提醒', href: '/notifications' },
    { label: '记事本', href: '/notes' },
    { label: 'Planet', href: '/planet' },
    { label: '设置', href: '/settings' },
  ];
});

const rootClasses = computed(() => ({
  origin: !extensionState.route.supported,
}));

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

const displayItems = computed(() => feedItems.value);
const primaryTabKey = computed<'all' | 'recent' | 'hot'>(() => {
  if (extensionState.route.recent) {
    return 'recent';
  }
  if (extensionState.route.tab === 'hot') {
    return 'hot';
  }
  return 'all';
});
const showNodeTabs = computed(() => primaryTabKey.value === 'all' && extensionState.route.index);

const selectedTopic = computed(() => {
  const matched = feedItems.value.find((item) => item.id === selectedTopicId.value || item.url === extensionState.readerUrl);
  return matched ?? feedItems.value[0] ?? null;
});

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

const openReader = async (item: Pick<TopicListItem, 'id' | 'url'> | Pick<HotTopicItem, 'id' | 'url'>) => {
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

        <div v-if="quickActions.length" class="k-sidebar-actions">
          <a v-for="item in quickActions" :key="item.href" class="k-sidebar-link" :href="item.href">
            <span>{{ item.label }}</span>
          </a>
        </div>

        <div v-if="userLinks.length || extensionState.user.loggedIn" class="k-sidebar-actions">
          <a v-for="item in userLinks" :key="item.href" class="k-sidebar-link" :href="item.href">
            <span>{{ item.label }}</span>
          </a>
          <button v-if="extensionState.user.loggedIn" class="k-sidebar-link k-sidebar-link-button" type="button" @click="configOpen = !configOpen">
            <span>外观</span>
          </button>
        </div>

        <a v-if="extensionState.user.loggedIn" class="k-sidebar-user" :href="`/member/${extensionState.user.name}`">
          <img :src="extensionState.user.avatar" :alt="extensionState.user.name" />
          <div class="k-sidebar-user-main">
            <span class="k-sidebar-user-name">{{ extensionState.user.name }}</span>
          </div>
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
                  <div class="k-section-route">
                    <template v-for="item in primaryTabs" :key="item.key">
                      <a
                        class="k-section-route-link"
                        :class="{ active: item.key === primaryTabKey }"
                        :href="item.href"
                      >
                        {{ item.label }}
                      </a>
                    </template>
                  </div>
                </div>
                <div class="k-section-links">
                  <a v-if="previousPage" :href="previousPage">上一页</a>
                  <a :href="nextPage">下一页</a>
                </div>
              </div>
              <div v-if="showNodeTabs" class="k-section-toolbar">
                <div ref="tabPillsRef" class="k-tab-pills k-tab-pills-secondary" @wheel.prevent="scrollTabs" @pointerdown="startTabDrag">
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
              <li v-for="item in displayItems" :key="item.id">
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
                  <span v-if="item.reply !== ''" class="k-feed-row-reply">{{ item.reply }}</span>
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
                <a class="k-reader-link" :href="selectedTopic.url" target="_blank" rel="noreferrer" aria-label="在新页面打开" title="在新页面打开">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      d="M11 3h6v6h-2V6.41l-7.29 7.3-1.42-1.42L13.59 5H11V3Zm4 14H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4v2H5v10h10v-4h2v4a2 2 0 0 1-2 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
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
          <div class="k-section-kicker">外观设置</div>
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
