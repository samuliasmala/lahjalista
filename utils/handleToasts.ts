import { toast } from 'react-toastify';

export function handleErrorToast(errorText: string) {
  try {
    const toastId = `toast-${errorText}`;
    const toastExists = document.getElementById(toastId);

    // if toast exists, reset timer
    if (toastExists) {
      toast.update(toastId, { progress: 0 });
      return;
    }

    toast(errorText, {
      type: 'error',
      toastId: toastId,
    });

    const observer = new MutationObserver(() => {
      const addedToast = document.getElementById(toastId);
      if (addedToast) {
        addedToast.addEventListener('mouseenter', () => {
          toast.update(toastId, { progress: 1 });
        });
        addedToast.addEventListener('mouseleave', () => {
          toast.update(toastId, { progress: 0 });
        });
        observer.disconnect();
        return;
      }
    });

    observer.observe(document.querySelector('.Toastify') || document.body, {
      childList: true, // Listen for addition/removal of child nodes
      subtree: true, // Include all child nodes, not just direct children
    });

    return;
  } catch (e) {
    console.error(e);
    return e;
  }
}
