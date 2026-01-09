import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from "../../config.tsx";
import Loader from "../loaders/Loader.tsx";
import Timer from "../components/Timer.tsx";
import avatarRobotPng from "../../assets/ai-avatar.png";
import microfonePng from "../../assets/microfone.png";

export interface Card {
    id: number;
    title: string;
    text: string;
    lesson_id?: number | null;
}

// этапы урока
type Stage = 'intro' | 'cards' | 'dialog' | 'finish';

function Lesson() {
    const mockCards: Card[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: new Date(Date.now() - Math.random() * 1e10).toISOString(),
        text: new Date(Date.now() - Math.random() * 1e9).toISOString(),
        lesson_id: Math.floor(Math.random() * 120) + 10,
    }));

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<Card[]>(mockCards);
    const [stage, setStage] = useState<Stage>('intro');
    const [isUseMicrofone, setUseMicrofone] = useState(false);
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch(API_URL + `/cards/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await res.json();
                if (!mounted) return;

                setCards(Array.isArray(data) ? data : [data]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex flex-col">

            {stage === 'intro' && (
                <div>
                    <h1 className="text-xl font-semibold font-mono">Произносите</h1>
                    <div className="flex flex-col gap-4 my-20 max-w-md mx-auto items-center">
                        <Timer
                            minutes={25}
                            isStarted={true}
                            finish_callback={() => setStage('cards')}
                            />

                        {cards.map((card) => (
                            <div key={card.id} className="border rounded-xl p-4">
                                <h2 className="font-semibold mb-2">{card.title}</h2>
                                <p className="text-sm whitespace-pre-line">{card.text}</p>
                            </div>
                        ))}

                        <button
                            onClick={() => setStage('dialog')}
                            className="mt-6 w-full py-3 rounded-xl bg-blue-500 text-white"
                        >
                            Далее
                        </button>
                    </div>
                </div>
            )}

            {stage === 'cards' && (
                <div className="w-full max-w-md flex flex-col gap-4 mt-6">

                </div>
            )}

            {/* ЭТАП 3 — диалог с ИИ */}
            {stage === 'dialog' && (

                <div>
                    <h1 className="text-2xl font-semibold font-mono">Диалог</h1>
                    <div className="flex flex-col gap-4 my-20 max-w-md mx-auto">

                        <img
                            src={avatarRobotPng}
                            alt="AI"
                            className="w-100 h-100 rounded-xl object-cover mx-auto"
                        />


                        {!isUseMicrofone ? (
                            <button className="dialog_btn">
                                <p className="text-center">Говорить</p>

                                <img src={microfonePng} className="p-1" alt="microfone"/>
                            </button>
                        ) : (
                            <button className="dialog_btn bg-blue-600">
                                <p className="text-center">Слушаю...</p>
                            </button>
                        )}

                        <p className="text-center hover:">*для чего?</p>


                    </div>
                </div>
            )}

            {stage === 'finish' && (
                <FinishLesson/>
            )}

        </div>
    );
}

export default Lesson;

const FinishLesson: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [holding, setHolding] = useState(false);

    useEffect(() => {
        if (!holding) return;

        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);
                    alert('Урок завершён');
                    return 100;
                }
                return p + 2; // 100 / 2% = ~5 сек
            });
        }, 100);

        return () => clearInterval(interval);
    }, [holding]);

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 mt-10">
            <h1 className="text-xl font-semibold">Завершение</h1>

            <button
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onMouseLeave={() => setHolding(false)}
                onTouchStart={() => setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                className="relative w-full py-4 rounded-xl bg-blue-500 text-white overflow-hidden"
            >
                <span className="relative z-10">Закончить урок</span>
                <div
                    className="absolute inset-0 bg-blue-700"
                    style={{ width: `${progress}%` }}
                />
            </button>
        </div>
    );
};