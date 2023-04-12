import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"></div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/logo.webp"
          alt="Next.js Logo"
          width={300}
          height={64}
          priority
        />
      </div>

      <div className="mb-32">
        <Link href="/photos">
          <h1
            className={`${inter.className} text-center text-xl font-bold text-black drop-shadow-md transition-all hover:scale-105`}
          >
            Press Here to Enter Site
          </h1>
        </Link>
      </div>
    </main>
  );
}
