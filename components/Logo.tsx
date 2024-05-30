import Image from 'next/image';

export function Logo() {
  return (
    <div className="pt-16 flex items-center justify-center select-none">
      <Image
        width={128}
        height={128}
        priority={true}
        alt="logo"
        src="/images/logo_no_text.png"
        className="w-32 h-32 max-w-max"
      />
      <p className="absolute pb-5 font-bold text-sm">LAHJAIDEA</p>
      <p className="absolute pt-5 text-gray-400">LISTA</p>
    </div>
  );
}
