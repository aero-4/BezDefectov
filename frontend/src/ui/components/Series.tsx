import {useEffect, useMemo, useState} from 'react';
import fireActivePng from "../../assets/fire-active.png";
import fireInactivePng from "../../assets/fire-disabled.png";

function Series({series_day, series_last = []}) {
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

    const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

    const processedSeries = useMemo(() => {
        if (!Array.isArray(series_last) || series_last.length === 0) return [];

        const sorted = [...series_last].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const toUtcDayIndex = (d: Date) =>
            Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000);

        return sorted.map((item, idx, arr) => {
            const dateObj = new Date(item.created_at);
            const utcIndex = toUtcDayIndex(dateObj);
            let hasFire = true;
            if (idx > 0) {
                const prevDate = new Date(arr[idx - 1].created_at);
                const prevUtcIndex = toUtcDayIndex(prevDate);
                hasFire = utcIndex === prevUtcIndex + 1;
            }
            return {
                ...item,
                dateObj,
                utcIndex,
                hasFire,
            };
        });
    }, [series_last]);

    return (
        <div className="fixed flex z-100 top-0 bottom-0 left-0 right-0 w-full h-full gap-3 bg-yellow-400">
            <div className="flex flex-col gap-10 items-center my-auto justify-center mx-auto text-sm">

                <div
                    className={
                        `flex w-32 h-32 items-center justify-center rounded-full text-5xl font-semibold
transition-all duration-500 ease-out
${show
                            ? 'opacity-100 scale-100 translate-y-0 bg-orange-500 text-white shadow-lg'
                            : 'opacity-0 scale-75 translate-y-3 bg-orange-100 text-white'}
${pulse ? 'ring-4 ring-orange-400 ring-offset-2 scale-110' : ''}`
                    }
                >
                    {series_day}
                </div>

                <div className="flex flex-row items-center text-gray-100 text-xl text-center">
                    <img src={fireActivePng} alt="fire" className="w-8"/>
                    <span className="text-black">Ваша новая серия обновлена!</span>
                </div>

                <div className="flex flex-row gap-2 bg-gray-200 p-2 rounded-3xl w-full ">
                    {processedSeries.map((series) => {
                        const day = series.dateObj.getDate().toString();
                        const formattedDate = `${day}`;

                        return (
                            <div
                                key={series.id || series.created_at}
                                className="flex flex-col p-4 md:p-6 bg-gray-100 items-center rounded-xl w-full"
                            >
                                <p className="text-2xl">{formattedDate}</p>

                                <p>{weekdays[series.dateObj.getDay()]}</p>


                                {series.hasFire ? (
                                    <img src={fireActivePng} alt="fireActive" className="w-7"/>
                                ) : (
                                    <img src={fireInactivePng} alt="fireInactive" className="w-7"/>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Series;
