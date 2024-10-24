import { toast } from 'react-toastify';

export function handleErrorToast(errorText: string) {
  try {
    const toastId = toast(errorText, {
      type: 'error',
      toastId: window.crypto.randomUUID(),
    });

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node) => {
          // check if node is an HTMLElement which unlock a usage of node.children
          if (node instanceof HTMLElement) {
            // if there are more than 1 toast, this should be working
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

            // the first toast seems to be always foundable using this for-loop
            for (let x = 0; x < node.children.length; x++) {
              const childNode = node.children[x];
              if (childNode.id === toastId.toString()) {
                // checking if childNode is an HTMLElement so correct event listener list will be shown
                // in theory this might not be needed but added for now
                if (childNode instanceof HTMLElement) {
                  childNode.addEventListener('mouseenter', () => {
                    toast.update(toastId, { progress: 1 });
                  });
                  childNode.addEventListener('mouseleave', () => {
                    toast.update(toastId, { progress: 0 });
                  });
                  observer.disconnect();
                  break;
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
