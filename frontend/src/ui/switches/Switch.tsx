import React from "react";
import closeSvg from "../../assets/close.svg";

export default function SwitchWithCross({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex flex-row gap-2 outline-none focus:outline-none active:outline-none"
        >
            <span
                className={`my-auto w-5 h-5 bg-gray-100 flex text-gray-500`}
            >
                {checked && (
                    <img src={closeSvg} alt="close"/>
                )}
            </span>

            <span className="text-left flex my-auto select-none font-semibold text-sm">
                {label}
            </span>
        </button>
    );
}
