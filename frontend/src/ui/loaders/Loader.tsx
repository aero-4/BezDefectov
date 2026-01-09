import React from 'react';

export default function Loader({size = 3}): JSX.Element {
    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-white flex mx-auto justify-center items-center z-50 ">
            <span className={`p-${size} rounded-full animate-spin border-5 border-blue-700 border-t-transparent`}>
            </span>
        </div>
    );
}