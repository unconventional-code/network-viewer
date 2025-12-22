export const calculateTimings = (pages) =>
  pages.reduce(
    ({ DOMContentLoaded, onLoad }, { pageTimings }) => ({
      DOMContentLoaded: DOMContentLoaded + pageTimings.onContentLoad,
      onLoad: onLoad + pageTimings.onLoad,
    }),
    {
      DOMContentLoaded: 0,
      onLoad: 0,
    }
  );
