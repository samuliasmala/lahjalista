import { toast } from 'react-toastify';

export function handleErrorToast(errorText: string) {
  try {
    const toastExists = document.getElementById(errorText);
    if (toastExists) {
      toast.update(errorText, { progress: 0 });
      return;
    }

    toast(errorText, {
      type: 'error',
      toastId: errorText,
    });

    const observer = new MutationObserver(() => {
      const addedToast = document.getElementById(errorText);
      if (addedToast) {
        addedToast.addEventListener('mouseenter', () => {
          toast.update(errorText, { progress: 1 });
        });
        addedToast.addEventListener('mouseleave', () => {
          toast.update(errorText, { progress: 0 });
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
