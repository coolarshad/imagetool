/**
 * ImageToolLab v2 - Header, Navigation & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenuDrawer.classList.contains('hidden');
      if (isOpen) {
        mobileMenuDrawer.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenuDrawer.classList.remove('hidden');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Desktop Tools Dropdown
  const toolsBtn = document.getElementById('tools-dropdown-btn');
  const toolsMenu = document.getElementById('tools-dropdown-menu');
  const toolsChevron = document.getElementById('tools-chevron');
  const dropdownContainer = document.getElementById('tools-dropdown-container');

  if (toolsBtn && toolsMenu) {
    toolsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !toolsMenu.classList.contains('hidden');
      if (isOpen) {
        toolsMenu.classList.add('hidden');
        if (toolsChevron) toolsChevron.classList.remove('rotate-180');
        toolsBtn.setAttribute('aria-expanded', 'false');
      } else {
        toolsMenu.classList.remove('hidden');
        if (toolsChevron) toolsChevron.classList.add('rotate-180');
        toolsBtn.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (e) => {
      if (dropdownContainer && !dropdownContainer.contains(e.target)) {
        toolsMenu.classList.add('hidden');
        if (toolsChevron) toolsChevron.classList.remove('rotate-180');
        toolsBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // FAQ Accordions
  const faqButtons = document.querySelectorAll('.faq-accordion-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const icon = btn.querySelector('.faq-chevron');

      if (content) {
        const isHidden = content.classList.contains('hidden');
        content.classList.toggle('hidden', !isHidden);
        if (icon) icon.classList.toggle('rotate-180', isHidden);
      }
    });
  });
});
