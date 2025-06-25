import { useState } from "react";
const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
   <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between py-2 sm:py-0">
          <a href="/" className="text-xl font-bold transition-colors text-neutral-950 hover:text-blue-800">E-Commerce</a>
          <button onClick={() =>
            setIsOpen(!isOpen)}className="flex cursor-pointer text-neutral-950 hover:text-black focus:outline-none sm:hidden">
            <img src=
            {isOpen ? "icons/close.svg" : "icons/menu.svg"}className="w-6 h-6"alt="toggle"/>
          </button>
          </div>
          </div>
          </div>
    
  )
}

export default Navigation