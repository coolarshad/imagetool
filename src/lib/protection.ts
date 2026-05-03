/**
 * Obfuscation & Protection Utility
 * Discourages unauthorized inspection and tampering.
 */

export function initProtection() {
  if (process.env.NODE_ENV === 'production') {
    // Disable right-click globally
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable keyboard shortcuts for DevTools
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });

    // Anti-debugging loop
    setInterval(() => {
      (function() {
        // This is a common trick to pause execution if DevTools is open
        // @ts-ignore
        (function a() { try { (function b(i) { if (('' + (i / i)).length !== 1 || i % 20 === 0) { (function() {}).constructor('debugger')(); } else { debugger; } b(++i); })(0); } catch (e) { setTimeout(a, 5000); } })();
      })();
    }, 1000);

    // Clear console periodically
    setInterval(() => {
      console.clear();
      console.log('%cPixelPerfect Security Active', 'color: #6366f1; font-size: 20px; font-weight: bold;');
      console.log('Unauthorized access is prohibited.');
    }, 2000);
  }
}
