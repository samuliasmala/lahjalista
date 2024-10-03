import { toast } from 'react-toastify';

export function addToastTimerReset(toastId: number, document: Document) {
  setTimeout(() => {
    document
      .getElementById(toastId.toString())
      ?.addEventListener('mouseenter', () => {
        toast.update(toastId, {
          progress: 1,
        });
      });
    document
      .getElementById(toastId.toString())
      ?.addEventListener('mouseleave', () => {
        toast.update(toastId, {
          progress: 0,
        });
      });
  }, 1);
}

function generateToastID() {
  return checkIsIdOccupied(randomId());
}

function randomId() {
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  const randomLength = Math.floor(Math.random() * (100 - 75) + 75);
  for (let x = 0; x < randomLength; x++) {
    const randomPosition = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPosition, randomPosition + 1);
  }

  //return Math.floor(Math.random() * 100000000);
  return randomString;
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
          console.log('Done');
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
