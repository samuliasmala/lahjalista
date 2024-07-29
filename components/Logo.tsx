import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

type Logo = {
  wrapperClassName?: string;
  logoBackgroundClassName?: string;
  lahjaideaClassName?: string;
  listaClassName?: string;
};

export function Logo({
  lahjaideaClassName,
  listaClassName,
  logoBackgroundClassName,
  wrapperClassName,
}: Logo) {
  return (
    <div
      className={twMerge(
        `mt-16 flex items-center justify-center select-none`,
        wrapperClassName,
      )}
    >
      <Image
        width={128}
        height={128}
        priority={true}
        alt="logo"
        src="/images/logo_no_text.png"
        className={twMerge(`w-32 h-32 max-w-max`, logoBackgroundClassName)}
      />
      <p
        className={twMerge(
          `absolute mb-5 font-bold text-sm`,
          lahjaideaClassName,
        )}
      >
        LAHJAIDEA
      </p>
      <p className={twMerge('absolute mt-5 text-gray-400', listaClassName)}>
        LISTA
      </p>
    </div>
  );
}
