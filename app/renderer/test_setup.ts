// Only specs with a window load Testing Library, so the node specs stay quick.
if (typeof window !== 'undefined') {
  // jsdom's window is 1024 wide, which is the app's floating layout. Tests begin at
  // the app's own default width, and narrow it when that's what they're about.
  window.innerWidth = 1280

  // findBy and waitFor give up after one second by default. With the whole suite
  // running, a page that shows in a tenth of that alone can take over a second,
  // so every wait gets five. A wait still ends as soon as what it waits for shows.
  const { configure } = await import('@testing-library/preact')
  configure({ asyncUtilTimeout: 5_000 })
}

// A module, so the import above can be awaited.
export {}
