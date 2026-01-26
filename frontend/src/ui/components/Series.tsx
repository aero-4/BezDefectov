import {useEffect, useMemo, useState} from 'react';
import firePng from "../../assets/fire.png";

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
        <div className="fixed flex z-100 top-0 bottom-0 left-0 right-0 w-full h-full gap-3 bg-yellow-400 my-auto">
            <div className="flex flex-col gap-12 items-center my-auto justify-center mx-auto">

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
                    <img src={firePng} alt="fire" className="w-8"/>
                    <span className="ml-2">Поздравляем c новой серией!</span>
                </div>

                <div className="flex flex-row gap-3 bg-gray-200 p-3">
                    {processedSeries.map((series) => (
                        <div
                            key={series.id || series.created_at}
                            className="flex flex-col gap-3 p-5 bg-gray-100 items-center"
                        >
                            <p>{weekdays[series.dateObj.getDay()]}</p>
                            {series.hasFire ? (
                                <img src={firePng} alt="fire" className="w-4"/>
                            ) : (
                                <div style={{width: 16, height: 16}} aria-hidden/>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Series;
