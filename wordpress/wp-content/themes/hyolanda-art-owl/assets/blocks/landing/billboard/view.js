const BLOCK_SELECTOR = '.wp-block-landing-billboard';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function setupBillboard(block) {
  const content = block.querySelector('.landing-billboard__content');
  const track = block.querySelector('.landing-billboard__track');
  const group = track?.querySelector('.landing-billboard__group');
  const title = group?.querySelector('.landing-billboard__title');

  if (!content || !track || !group || !title) {
    return;
  }

  const originalTitle = title.cloneNode(true);
  if (!originalTitle.textContent.trim()) {
    return;
  }

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

  const update = () => {
    group.replaceChildren(originalTitle.cloneNode(true));
    track
      .querySelectorAll('.landing-billboard__group + .landing-billboard__group')
      .forEach((duplicate) => duplicate.remove());
    track.classList.remove('is-ready');

    if (reducedMotion.matches || !content.clientWidth) {
      return;
    }

    while (group.scrollWidth < content.clientWidth) {
      const repeatedTitle = originalTitle.cloneNode(true);
      repeatedTitle.setAttribute('aria-hidden', 'true');
      group.append(repeatedTitle);
    }

    const duplicateGroup = group.cloneNode(true);
    duplicateGroup.setAttribute('aria-hidden', 'true');
    track.append(duplicateGroup);
    track.classList.add('is-ready');
  };

  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(content);
  reducedMotion.addEventListener('change', update);
  update();
}

function initBillboards() {
  document.querySelectorAll(BLOCK_SELECTOR).forEach(setupBillboard);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBillboards, { once: true });
} else {
  initBillboards();
}
