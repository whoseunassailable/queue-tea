// jsdom's window is 1024 wide, which is the app's floating layout. Tests begin at
// the app's own default width, and narrow it when that's what they're about.
if (typeof window !== 'undefined') window.innerWidth = 1280
