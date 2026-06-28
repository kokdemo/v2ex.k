import type { RouteInfo } from '@/lib/types';

export function isManagedPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/recent' || pathname === '/my/topics' || pathname.startsWith('/go/');
}

export function detectRoute(doc: Document = document): RouteInfo {
  const url = new URL(doc.location.href);
  const pathname = url.pathname;
  const topLinks = doc.querySelectorAll('#Top .top');
  const topicId = url.searchParams.get('topicID');
  const iframeUrl = url.searchParams.get('iframe');
  const node = pathname.startsWith('/go/');
  const topic = pathname.startsWith('/t/');
  const recent = pathname === '/recent';
  const index = pathname === '/';
  const myTopics = pathname === '/my/topics';
  const nodeBreadcrumb = doc.querySelector('.node-header .node-breadcrumb')?.textContent?.replace(/^V2EX\s*›\s*/, '').trim();
  const nodeText = node ? nodeBreadcrumb || decodeURIComponent(pathname.split('/go/')[1] ?? '') : null;
  const frame = window.self !== window.top;

  return {
    currentUrl: url.toString(),
    origin: url.origin,
    pathname,
    page: Number.parseInt(url.searchParams.get('p') ?? '1', 10) || 1,
    tab: url.searchParams.get('tab'),
    node,
    nodeText,
    topic,
    recent,
    index,
    myTopics,
    login: topLinks.length !== 3,
    supported: isManagedPath(pathname),
    frame,
    topicId,
    iframeUrl,
  };
}

export function buildPageLink(route: RouteInfo, page: number): string {
  const url = new URL(route.currentUrl);
  if (page <= 1) {
    url.searchParams.delete('p');
  } else {
    url.searchParams.set('p', String(page));
  }
  url.searchParams.delete('topicID');
  url.searchParams.delete('iframe');
  return `${url.pathname}${url.search}`;
}

export function buildReaderUrl(itemUrl: string): string {
  return itemUrl.startsWith('http') ? itemUrl : new URL(itemUrl, window.location.origin).toString();
}

export function updateReaderQuery(itemUrl: string): void {
  const url = new URL(window.location.href);
  const normalized = buildReaderUrl(itemUrl);
  const topicId = normalized.match(/\/t\/([^/?#]+)/)?.[1] ?? null;

  if (topicId) {
    url.searchParams.set('topicID', topicId);
  }
  url.searchParams.set('iframe', normalized);
  history.pushState({ topicID: topicId }, '', `${url.pathname}${url.search}`);
}
