import { RiMenuLine } from '@remixicon/react'
import React from 'react'

export default function MobilePhase() {
  return (
    <>
    <details className="dropdown md:hidden">
  <summary className="p-2 outline-none border-none bg-transparent hover:bg-transparent list-none appearance-none">
    <RiMenuLine size={24} />
  </summary>
  <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-25 p-2 shadow-sm">
    <li className="cursor-pointer hover:text-blue-500">Features</li>
    <a href="#how-it-works"><li className="cursor-pointer  hover:text-blue-500 ">How It Works</li></a>
    <a href="/contact"><li className="cursor-pointer  hover:text-blue-500 ">Contact Us</li></a>
  </ul>
</details>

    
    </>
  )
}
