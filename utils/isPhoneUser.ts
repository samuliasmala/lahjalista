// CHECK THIS, onko tässä mitään järkeä?

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
