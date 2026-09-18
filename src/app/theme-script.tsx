/**
 * Applies the stored theme before first paint.
 *
 * Without this, someone who chose dark gets a flash of the light theme while
 * React hydrates. It has to be a blocking inline script in <head> — any
 * later and the flash has already happened.
 */
export function ThemeScript() {
  const script = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || t === 'light') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`.trim();

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
