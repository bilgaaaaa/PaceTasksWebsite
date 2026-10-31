// Shared by every page: once the page scrolls, the header turns into a frosted bar.
(function () {
  const root = document.documentElement;
  let frameRequested = false;

  const updateHeader = () => {
    root.classList.toggle("is-scrolled", window.scrollY > 24);
    frameRequested = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateHeader);
    },
    { passive: true }
  );
  updateHeader();
})();
