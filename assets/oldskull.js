/**
 * Adjusts vertical position of the gift icon and popup on mobile
 * based on sticky ATC visibility and scroll state.
 * - Gift icon: 85px (visible) / 10px (hidden)
 * - Popup: 125px (visible) / 50px (hidden)
 */

document.addEventListener('DOMContentLoaded', () => {
    const stickyAtc = document.querySelector('.sticky-atc');
    if (!stickyAtc) return;

    // Handles positioning logic for each element
    const updateElementPosition = (el, visibleOffset, hiddenOffset) => {
        const isMobile = window.innerWidth < 768;
        const isScrolledToBottom = document.body.classList.contains('scrolled-to-bottom');
        const isStickyVisible = !stickyAtc.classList.contains('sticky-atc--out');

        if (isMobile) {
            const offset = (isStickyVisible && !isScrolledToBottom) ? visibleOffset : hiddenOffset;
            el.style.setProperty('bottom', `${offset}px`, 'important');
        } else {
            // Reset inline style on desktop
            el.style.removeProperty('bottom');
        }
    };

    // Sets up observers for sticky ATC, scroll class, and window resize
    const initializeStickyElement = (selector, visibleOffset, hiddenOffset) => {
        const el = document.querySelector(selector);
        if (!el) return false;

        updateElementPosition(el, visibleOffset, hiddenOffset);

        const handleClassChange = () => updateElementPosition(el, visibleOffset, hiddenOffset);

        new MutationObserver(handleClassChange).observe(stickyAtc, {
            attributes: true,
            attributeFilter: ['class']
        });

        new MutationObserver(handleClassChange).observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        window.addEventListener('resize', () => updateElementPosition(el, visibleOffset, hiddenOffset), { passive: true });

        return true;
    };

    // Check and initialize both gift icon and popup
    const checkAndInitStickyElements = () => {
        const iconReady = initializeStickyElement('#tdf_notify .tdf_notify_minicon', 95, 10);
        const popupReady = initializeStickyElement('#tdf_notify .tdf_notify_popup', 135, 50);
        return iconReady || popupReady;
    };

    // Defer if elements aren't in DOM yet
    if (!checkAndInitStickyElements()) {
        const domObserver = new MutationObserver((mutations, observer) => {
            if (checkAndInitStickyElements()) {
                observer.disconnect();
            }
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});
