import menuPng from "../../assets/menu.png";
import React from 'react';

function BurgerMenu({ onClick }) {
    return (
        <button
            type="button"
            className="p-4 hover:opacity-90 active:opacity-75 relative"
            onClick={onClick}
        >
            <img className="w-6" src={menuPng} alt="menu" />
        </button>
    );
}

export default BurgerMenu;