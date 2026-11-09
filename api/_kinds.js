// Lucide icons (https://lucide.dev, ISC licence, lucide-static 0.460.0) standing in
// for the app's SF Symbols, which may not be used outside Apple platforms:
// figure.run → bike, leaf → leaf, wineglass → wine, fork.knife → utensils,
// theatermasks → drama, book → book-open, sparkles → sparkles.
export const KIND_ICONS = {
  "active": "<circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\" /> <circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\" /> <circle cx=\"15\" cy=\"5\" r=\"1\" /> <path d=\"M12 17.5V14l-3-3 4-3 2 3h2\" />",
  "outdoors": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\" /> <path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" />",
  "drinks": "<path d=\"M8 22h8\" /> <path d=\"M7 10h10\" /> <path d=\"M12 15v7\" /> <path d=\"M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z\" />",
  "food": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />",
  "culture": "<path d=\"M10 11h.01\" /> <path d=\"M14 6h.01\" /> <path d=\"M18 6h.01\" /> <path d=\"M6.5 13.1h.01\" /> <path d=\"M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3\" /> <path d=\"M17.4 9.9c-.8.8-2 .8-2.8 0\" /> <path d=\"M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7\" /> <path d=\"M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4\" />",
  "study": "<path d=\"M12 7v14\" /> <path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
  "other": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /> <path d=\"M20 3v4\" /> <path d=\"M22 5h-4\" /> <path d=\"M4 17v2\" /> <path d=\"M5 18H3\" />"
};

// ActivityKind.wash and .ink in the app (DesignToken.Color, light mode).
export const KIND_COLOURS = {
  active: { wash: '#e2f1e8', ink: '#2f7a55' },
  outdoors: { wash: '#ebf0dd', ink: '#5a762e' },
  drinks: { wash: '#f1e9f6', ink: '#7a5296' },
  food: { wash: '#fcebdd', ink: '#b0602c' },
  culture: { wash: '#f9e6ea', ink: '#a34d62' },
  study: { wash: '#e3edf8', ink: '#3d6896' },
  other: { wash: '#f5eee1', ink: '#8a6a35' },
};
