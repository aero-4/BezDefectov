import React from 'react';
import menuPng from "../../assets/menu.png";

function Navbar() {
    return (
        <div className="flex flex-row gap-3 my-6">

            <a className="p-3 hover:opacity-70" href="/">
                БезДефектов.ру
            </a>

            <button className="p-4 ml-auto">
                <img className="w-6" src={menuPng} alt="menu"/>
            </button>
        </div>
    );
}

export default Navbar;