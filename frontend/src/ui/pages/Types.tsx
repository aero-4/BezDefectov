import React from 'react';

function Types(props) {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-mono text-2xl">Тип</h1>

            <div className="flex flex-col gap-6 my-3">
                <a className="border-big p-12" href="/lessons/sh">Шипилявость - С, З, Ш, Ж</a>
                <a className="border-big p-12" href="/lessons/r">Картавость - Р</a>
            </div>
        </div>
    );
}

export default Types;