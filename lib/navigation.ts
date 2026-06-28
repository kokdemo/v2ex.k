export function installNavigationObserver(onChange: () => void): void {
  const notify = () => onChange();
  const rawPushState = history.pushState;
  const rawReplaceState = history.replaceState;

  history.pushState = function pushState(...args) {
    rawPushState.apply(this, args);
    window.dispatchEvent(new CustomEvent('v2exk:navigation'));
  };

  history.replaceState = function replaceState(...args) {
    rawReplaceState.apply(this, args);
    window.dispatchEvent(new CustomEvent('v2exk:navigation'));
  };

  window.addEventListener('popstate', notify);
  window.addEventListener('hashchange', notify);
  window.addEventListener('v2exk:navigation', notify);
}
