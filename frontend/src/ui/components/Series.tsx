import React, {useEffect, useState} from 'react';
import firePng from "../../assets/fire.png";

function Series({series_day}) {
    const [show, setShow] = useState(false);
    const [pulse, setPulse] = useState(false);


    useEffect(() => {
        if (series_day == null) return;

        setShow(false);
        setPulse(false);

        const t1 = setTimeout(() => setShow(true), 700);
        const t2 = setTimeout(() => setPulse(true), 1300);
        const t3 = setTimeout(() => setPulse(false), 1500);


        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [series_day]);


    return (
        <div className="fixed flex z-100 top-0 bottom-0 left-0 right-0 w-full h-full gap-3 bg-yellow-400 my-auto">
            <div className="flex flex-col gap-6 items-center my-auto justify-center items-center mx-auto">

                <div
                    className={
                        `flex w-32 h-32 items-center justify-center rounded-full text-6xl font-semibold
transition-all duration-500 ease-out
${show
                            ? 'opacity-100 scale-100 translate-y-0 bg-orange-500 text-white shadow-lg'
                            : 'opacity-0 scale-75 translate-y-3 bg-orange-100 text-white'}
${pulse ? 'ring-4 ring-orange-400 ring-offset-2 scale-110' : ''}`
                    }
                >
                    {show ? series_day : series_day - 1}
                </div>


                <div className="flex flex-row items-center text-gray-100 text-xl text-center">
                    <img src={firePng} alt="" className="w-8"/>

                    Поздравляем c новой серией!
                </div>
            </div>

        </div>
    );
}


export default Series;