// CHECK THIS, onko tässä mitään järkeä?

// Ei taida olla tarpeellinen, jos tämä tarkistus tehdään ainoastaan _app.tsx-tiedostossa. Turhaan on oma tiedostonsa tälle

export function isPhoneUser(window?: Window & typeof globalThis): boolean {
  if (window) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    if (screenWidth < 768 || screenHeight < 768) {
      return true;
    }
    return false;
  }
  return false;
}
