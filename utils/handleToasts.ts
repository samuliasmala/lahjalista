import { toast } from 'react-toastify';

export function handleErrorToast(errorText: string) {
  try {
    const toastId = toast(errorText, {
      type: 'error',
      toastId: window.crypto.randomUUID(),
      /*
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
      */
    });

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        // Check if the added nodes contain an element with the desired ID
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.id === toastId.toString()) {
              node.addEventListener('mouseenter', () => {
                toast.update(toastId, { progress: 1 });
              });
              node.addEventListener('mouseout', () => {
                toast.update(toastId, { progress: 0 });
              });
              observer.disconnect();
              return;
            }

            for (let x = 0; x < node.children.length; x++) {
              const childNode = node.children[x];
              if (childNode.id === toastId.toString()) {
                if (childNode instanceof HTMLElement) {
                  childNode.addEventListener('mouseenter', (e) => {
                    toast.update(toastId, { progress: 1 });
                  });
                  childNode.addEventListener('mouseleave', () => {
                    toast.update(toastId, { progress: 0 });
                  });
                  observer.disconnect(); // Optionally stop observing once the element is found
                  return;
                }
              }
            }
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true, // Listen for addition/removal of child nodes
      subtree: true, // Include all child nodes, not just direct children
    });

    return;
  } catch (e) {
    console.error(e);
    return e;
  }
}
