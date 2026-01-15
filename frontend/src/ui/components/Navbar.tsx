import { useState } from 'react';
import Menu from "./Menu.tsx";
import BurgerMenu from "../buttons/BurgerMenu.tsx";

function Navbar() {
    const [isVisibleMenu, setVisibleMenu] = useState(false);

    const closeMenu = () => setVisibleMenu(false);

    return (
        <>
            {isVisibleMenu && <Menu onClose={closeMenu} />}

            <header className="w-full h-24 bg-white z-40">
                <div className="relative h-full w-full">

                    <a
                        href="/"
                        className="absolute left-4 top-1/2 -translate-y-1/2 font-medium"
                    >
                        БезДефектов.ру
                    </a>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <BurgerMenu onClick={() => setVisibleMenu(true)}/>
                    </div>

                </div>
            </header>
        </>
    );
}

export default Navbar;