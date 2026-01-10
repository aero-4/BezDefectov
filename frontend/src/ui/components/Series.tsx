import React, { useEffect, useState } from 'react';


function Series({ series_day }) {
    const [show, setShow] = useState(false);
    const [pulse, setPulse] = useState(false);


    useEffect(() => {
        if (series_day == null) return;

        setShow(false);
        setPulse(false);

        const t1 = setTimeout(() => setShow(true), 200);
        const t2 = setTimeout(() => setPulse(true), 700);
        const t3 = setTimeout(() => setPulse(false), 1200);


        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [series_day]);


    return (
        <div className="fixed top-0 bottom-0 w-full h-full flex flex-col items-center gap-3 bg-orange-500">
            <div
                className={
                    `flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold
transition-all duration-500 ease-out
${show
                        ? 'opacity-100 scale-100 translate-y-0 bg-indigo-600 text-white shadow-lg'
                        : 'opacity-0 scale-75 translate-y-3 bg-indigo-300 text-white'}
${pulse ? 'ring-4 ring-indigo-400 ring-offset-2 scale-110' : ''}`
                }
            >
                {show ? series_day : 0}
            </div>

            <div className="text-center text-sm font-medium text-slate-600">
                Поздравляем! Серия была продолжена!
            </div>

        </div>
    );
}


export default Series;