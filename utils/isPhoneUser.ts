// CHECK THIS, onko tässä mitään järkeä?

export function isPhoneUser(window: Window & typeof globalThis): boolean {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  if (screenWidth < 768 || screenHeight < 768) {
    return true;
  }
  return false;
}
