import { toast } from 'react-toastify';

function generateToastID() {
  return checkIsIdOccupied(randomId());
}

function randomId() {
  return Math.floor(Math.random() * 100000000).toString();
}

function checkIsIdOccupied(toastId: string) {
  if (document.getElementById(toastId.toString()) !== null) {
    return checkIsIdOccupied(randomId());
  }
  return toastId;
}

export function handleErrorToast(errorText: string) {
  try {
    const generatedToastID = generateToastID();
    if (!document) {
      return;
    }

    toast(errorText, {
      type: 'error',
      toastId: generatedToastID,
      onOpen: () => {
        setTimeout(() => {
          document
            .getElementById(generatedToastID)
            ?.addEventListener('mouseenter', () => {
              toast.update(generatedToastID, {
                progress: 1,
              });
            });
          document
            .getElementById(generatedToastID)
            ?.addEventListener('mouseleave', () => {
              toast.update(generatedToastID, {
                progress: 0,
              });
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
