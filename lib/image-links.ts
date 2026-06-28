export function enhanceImageLinks(doc: Document = document): void {
  const links = doc.querySelectorAll<HTMLAnchorElement>("a[rel='nofollow']");
  const imagePattern = /\.(jpg|jpeg|gif|png|webp)$/i;

  links.forEach((link) => {
    if (!imagePattern.test(link.href) || link.dataset.v2exkImageEnhanced === '1') {
      return;
    }

    const image = doc.createElement('img');
    image.src = link.href;
    image.alt = link.textContent?.trim() ?? 'image';
    image.loading = 'lazy';
    image.style.maxWidth = '100%';

    link.textContent = '';
    link.appendChild(image);
    link.dataset.v2exkImageEnhanced = '1';
  });
}
