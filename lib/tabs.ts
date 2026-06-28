export interface NavItem {
  label: string;
  href: string;
}

export interface TabItem {
  label: string;
  href: string;
  tab: string;
}

export const loggedInNavItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '提醒', href: '/notifications' },
  { label: '新主题', href: '/new' },
  { label: '奖励', href: '/mission/daily' },
  { label: '节点', href: '/planes' },
  { label: '笔记', href: '/notes' },
  { label: '时间轴', href: '/t' },
  { label: '设置', href: '/settings' },
  { label: '退出', href: '/signout' },
];

export const loggedOutNavItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '注册', href: '/signup' },
  { label: '登录', href: '/signin' },
];

export const tabItems: TabItem[] = [
  { label: '全部', href: '/?tab=all', tab: 'all' },
  { label: '技术', href: '/?tab=tech', tab: 'tech' },
  { label: '创意', href: '/?tab=creative', tab: 'creative' },
  { label: '好玩', href: '/?tab=play', tab: 'play' },
  { label: 'Apple', href: '/?tab=apple', tab: 'apple' },
  { label: '酷工作', href: '/?tab=jobs', tab: 'jobs' },
  { label: '交易', href: '/?tab=deals', tab: 'deals' },
  { label: '城市', href: '/?tab=city', tab: 'city' },
  { label: '问与答', href: '/?tab=qna', tab: 'qna' },
  { label: '最热', href: '/?tab=hot', tab: 'hot' },
  { label: 'R2', href: '/?tab=r2', tab: 'r2' },
  { label: '节点', href: '/?tab=nodes', tab: 'nodes' },
  { label: '关注', href: '/?tab=members', tab: 'members' },
];
