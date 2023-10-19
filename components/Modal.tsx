import { ButtonHTMLAttributes } from "react";
import { FullLocalStorage } from "~/pages";



type ModalType = ButtonHTMLAttributes<HTMLButtonElement> & {
    gift: FullLocalStorage
}


export function Modal({
    gift,
    children,
    ...rest
}: ModalType
) {
    
}