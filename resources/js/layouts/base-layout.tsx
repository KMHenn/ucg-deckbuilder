import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function BaseLayout({ children }) {
      const { auth } = usePage<SharedData>().props;

  return (
    <div>
      <header className="py-4 border-b p-4">
        <nav className="justify-between flex">
          <div>
            <Link href="/" className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]">Home</Link>
            <Link href="/deckbuilder" className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]">Deckbuilder</Link>
            <Link href="/card-tracker" className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]">Card Tracker</Link>
          
          </div>
            {auth.user ? (<div></div>)
            : (<div>
                <Link href="/login" className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]">
                  Log in
                </Link>
                <Link href="register" className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]" >
                  Register
                </Link>
              </div>)
        }
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}