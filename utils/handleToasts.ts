import { toast } from 'react-toastify';

export function handleErrorToast(errorText: string) {
  try {
    const toastId = toast(errorText, {
      type: 'error',
      toastId: window.crypto.randomUUID(),
      onOpen: () => {
        setTimeout(() => {
          const toastEl = document.getElementById(toastId.toString());
          toastEl?.addEventListener('mouseenter', () => {
            toast.update(toastId, { progress: 1 });
          });
          toastEl?.addEventListener('mouseleave', () => {
            toast.update(toastId, { progress: 0 });
          });
        }, 1);
      },
    });
    return;
  } catch (e) {
    console.error(e);
    return e;
  }
}
