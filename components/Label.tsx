import { ReactNode } from 'react';

/*
<div id="receiverListContainer" className="mt-3">
          <div id="receiverTitle" className="text-2xl pt-4">
            Lahjaideat
          </div>
          <div id="giftData">
            {giftData.map(giftData => (
              <li key={giftData.id}>
                {giftData.name} - {giftData.gift}
              </li>
            ))}
          </div>
        </div>

*/

export function Label({
  id, htmlFor, className, children
}: {
  id?: string;
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
}) {
  return(
    <label id={id} htmlFor={htmlFor} className={className}>
      {children}
    </label>
  )
}
