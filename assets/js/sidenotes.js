// Position sidenotes next to their references in the text
(function() {
  // Only run on wide screens
  if (window.innerWidth < 1200) return;

  // Wait for page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', positionFootnotes);
  } else {
    positionFootnotes();
  }

  function positionFootnotes() {
    // Find all footnote references and footnote items
    const footnoteRefs = document.querySelectorAll('sup[id^="fnref:"]');
    const footnotesList = document.querySelector('.footnotes ol');

    // Find the positioning context (article for posts, section for regular pages)
    let container = document.querySelector('article.post, article.essay');
    if (!container) {
      container = document.querySelector('section');
    }

    if (!footnotesList || footnoteRefs.length === 0 || !container) return;

    const footnoteItems = Array.from(footnotesList.querySelectorAll('li'));
    const minSpacing = 20; // Minimum pixels between footnotes
    let previousBottom = 0;

    // Get the top position of the container (positioning context)
    const containerTop = container.getBoundingClientRect().top + window.scrollY;

    // Position each footnote next to its reference
    footnoteRefs.forEach((ref, index) => {
      const footnoteItem = footnoteItems[index];
      if (!footnoteItem) return;

      // Get the position of the reference in the text
      const refRect = ref.getBoundingClientRect();
      const refTop = refRect.top + window.scrollY;

      // Calculate position relative to container
      let topOffset = refTop - containerTop;

      // Prevent overlap: if this footnote would overlap with the previous one,
      // push it down below the previous one
      if (index > 0 && topOffset < previousBottom + minSpacing) {
        topOffset = previousBottom + minSpacing;
      }

      // Set the position
      footnoteItem.style.top = topOffset + 'px';

      // Update previousBottom for next iteration
      const footnoteHeight = footnoteItem.offsetHeight || 100;
      previousBottom = topOffset + footnoteHeight;
    });
  }

  // Re-position on window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (window.innerWidth >= 1200) {
        positionFootnotes();
      }
    }, 250);
  });
})();
