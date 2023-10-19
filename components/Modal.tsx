import { ButtonHTMLAttributes, useState } from "react";
import { FullLocalStorage } from "~/pages";
import { Button } from "./Button";



type ModalType = ButtonHTMLAttributes<HTMLButtonElement> & {
    gift: FullLocalStorage
}


export function Modal({
    gift,
    children,
    ...rest
}: ModalType
) {
    const [openWindow, setOpenWindow] = useState(false);
    if(typeof gift === "undefined") return null
    return(
        <>
        <Button
        key={`${gift.id}_deletebutton`}
        onMouseOver={(e) => {
          // can use statement *as* here due to the button being inside of the li parentElement
          (e.currentTarget.parentElement as HTMLElement).className =
            'line-through';
        }}
        onMouseOut={(e) => {
          // can use statement *as* here due to the button being inside of the li parentElement
          (e.currentTarget.parentElement as HTMLElement).className = '';
        }}
        className="ms-5 p-0 w-16 h-8 hover:text-red-600"
        onClick={() => setOpenWindow(true)}
        type="button"
        {...rest}
      >
        {children}
      </Button>
        </>
    )
}