import type { HotTopicItem, RouteInfo, TopicListItem, UserInfo } from '@/lib/types';

function normalizeUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }
  return url.startsWith('http') ? url : new URL(url, window.location.origin).toString();
}

function normalizeAvatar(url: string | null | undefined): string {
  if (!url) {
    return '';
  }
  if (url.startsWith('//')) {
    return `${window.location.protocol}${url}`;
  }
  return normalizeUrl(url);
}

export function extractUserInfo(doc: Document = document): UserInfo {
  const topLinks = doc.querySelectorAll('#Top .top');
  const rightbar = doc.querySelector('#Rightbar');
  const loggedIn = topLinks.length !== 3 && !!rightbar;

  if (!loggedIn) {
    return {
      loggedIn: false,
      name: '',
      avatar: '',
    };
  }

  const profileLink =
    doc.querySelector('#Rightbar .box .cell table a[href*="/member/"]') ??
    doc.querySelector('#Top a[href*="/member/"]');
  const avatar =
    doc.querySelector<HTMLImageElement>('#Rightbar .box .cell table img') ??
    doc.querySelector<HTMLImageElement>('#Top img.avatar');

  const name = profileLink?.getAttribute('href')?.split('/member/')[1] ?? profileLink?.textContent?.trim() ?? '';

  return {
    loggedIn: true,
    name,
    avatar: normalizeAvatar(avatar?.getAttribute('src')),
  };
}

export function extractTopicList(route: RouteInfo, doc: Document = document): TopicListItem[] {
  const nodes = route.node
    ? Array.from(doc.querySelectorAll<HTMLElement>('#TopicsNode > .cell'))
    : Array.from(doc.querySelectorAll<HTMLElement>('.cell.item'));

  return nodes
    .map((node) => {
      const avatarLink = node.querySelector<HTMLAnchorElement>('a[href*="/member/"]');
      const avatar = node.querySelector<HTMLImageElement>('img');
      const titleLink = node.querySelector<HTMLAnchorElement>('.item_title a');
      const nodeLink = node.querySelector<HTMLAnchorElement>('.node');
      const replyElement = node.querySelector<HTMLElement>('.count_livid');
      const topicInfo = node.querySelector<HTMLElement>('.topic_info');
      const timeElement = topicInfo?.querySelector<HTMLSpanElement>('span[title]');
      const memberLinks = topicInfo?.querySelectorAll<HTMLAnchorElement>('a[href*="/member/"]') ?? [];
      const lastReplyByLink = memberLinks.length > 1 ? memberLinks[memberLinks.length - 1] : null;

      if (!avatarLink || !titleLink) {
        return null;
      }

      const url = normalizeUrl(titleLink.getAttribute('href'));
      const id = url.match(/\/t\/([^/?#]+)/)?.[1] ?? url;

      return {
        id,
        url,
        title: titleLink.textContent?.trim() ?? '',
        avatar: normalizeAvatar(avatar?.getAttribute('src')),
        userUrl: normalizeUrl(avatarLink.getAttribute('href')),
        userName: avatarLink.getAttribute('href')?.split('/member/')[1] ?? '',
        nodeUrl: nodeLink ? normalizeUrl(nodeLink.getAttribute('href')) : null,
        nodeText: nodeLink?.textContent?.trim() ?? route.nodeText,
        reply: Number.parseInt(replyElement?.textContent?.trim() ?? '0', 10) || 0,
        lastReplyText: timeElement?.textContent?.trim() ?? null,
        lastReplyAt: timeElement?.getAttribute('title')?.trim() ?? null,
        lastReplyBy: lastReplyByLink?.textContent?.trim() ?? null,
      } satisfies TopicListItem;
    })
    .filter((item): item is TopicListItem => item !== null);
}

export function resolveInitialReaderUrl(route: RouteInfo, items: TopicListItem[]): string {
  if (route.iframeUrl) {
    return normalizeUrl(route.iframeUrl);
  }
  if (route.topicId) {
    const matched = items.find((item) => item.id === route.topicId);
    if (matched) {
      return matched.url;
    }
  }
  return items[0]?.url ?? '';
}

export function extractHotTopics(doc: Document = document): HotTopicItem[] {
  const boxes = Array.from(doc.querySelectorAll<HTMLElement>('#Rightbar .box'));
  const hotBox =
    boxes.find((box) => box.textContent?.includes('今日热议主题')) ??
    boxes.find((box) => box.querySelector('a[href*="/t/"]'));

  if (!hotBox) {
    return [];
  }

  const links = Array.from(hotBox.querySelectorAll<HTMLAnchorElement>('a[href*="/t/"]'));
  const seen = new Set<string>();

  return links
    .map((link) => {
      const url = normalizeUrl(link.getAttribute('href'));
      const id = url.match(/\/t\/([^/?#]+)/)?.[1] ?? url;
      const title = link.textContent?.trim() ?? '';
      const row =
        link.closest<HTMLElement>('.cell') ??
        link.closest<HTMLElement>('tr') ??
        link.closest<HTMLElement>('li') ??
        link.parentElement;
      const avatar = normalizeAvatar(row?.querySelector<HTMLImageElement>('img')?.getAttribute('src'));

      if (!url || !title || seen.has(id)) {
        return null;
      }

      seen.add(id);

      return {
        id,
        url,
        title,
        avatar,
      } satisfies HotTopicItem;
    })
    .filter((item): item is HotTopicItem => item !== null)
    .slice(0, 10);
}
