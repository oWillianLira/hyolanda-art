/**
 * Lightweight frontend parallax controller for Landing Hero blocks.
 *
 * This file is intentionally separate from the block editor bundle.
 * It can be included by the theme's shared frontend entry point.
 */

const SPEEDS = {
    slow: 0.08,
    medium: 0.14,
    fast: 0.22,
};

function updateParallax(block) {
    const speed = SPEEDS[block.dataset.parallaxSpeed];

    if (!speed) {
        return;
    }

    const rect = block.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const blockCenter = rect.top + rect.height / 2;
    const offset = (viewportCenter - blockCenter) * speed;

    block.style.setProperty(
        '--landing-hero-parallax-offset',
        `${offset}px`
    );
}

function initParallax() {
    const blocks = document.querySelectorAll(
        '.wp-block-landing-hero[data-parallax-speed]'
    );

    if (!blocks.length) {
        return;
    }

    let ticking = false;

    const update = () => {
        blocks.forEach(updateParallax);
        ticking = false;
    };

    const requestUpdate = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
} else {
    initParallax();
}
