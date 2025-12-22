import { Page } from "har-format";

export const calculateTimings = (pages: Page[]) =>
  pages.reduce(
    ({ DOMContentLoaded, onLoad }, { pageTimings }) => ({
      DOMContentLoaded: DOMContentLoaded + (pageTimings.onContentLoad || 0),
      onLoad: onLoad + (pageTimings.onLoad || 0),
    }),
    {
      DOMContentLoaded: 0,
      onLoad: 0,
    }
  );
