import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config.tsx';
import Loader from '../loaders/Loader.tsx';
import Timer from '../components/Timer.tsx';
import avatarRobotPng from '../../assets/ai-avatar.png';
import microfonePng from '../../assets/microfone.png';
import Tooltip from "../buttons/Tooltip.tsx";
import Series from "../components/Series.tsx";

export interface Card {
    id: number;
    title: string;
    text: string;
    lesson_id?: number | null;
}

type Lesson = {
    id: number;
    created_at: string;
    updated_at: string;
    duration: number;
    type: string;
};

type Stage = 'intro' | 'cards' | 'dialog' | 'finish';

function Lesson() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [stage, setStage] = useState<Stage>('intro');


    const [isUseMicrofone, setUseMicrofone] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [webrtcStatus, setWebrtcStatus] = useState('idle');
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const [series, setSeries] = useState(null)

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch(API_URL + `/lessons/${id}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (mounted) setLesson(data);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch(API_URL + `/cards/${id}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (mounted) setCards(Array.isArray(data) ? data : [data]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading || !lesson) return <Loader />;

    const groupedCards = cards.reduce<Record<string, Card[]>>((acc, card) => {
        if (!acc[card.title]) acc[card.title] = [];
        acc[card.title].push(card);
        return acc;
    }, {});

    const requestMicAndStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalStream(stream);
            setUseMicrofone(true);

            const mr = new MediaRecorder(stream);
            const chunks: Blob[] = [];
            mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
            mr.onstop = () => setAudioChunks(chunks.slice());
            mr.start();

            setRecorder(mr);
            setIsRecording(true);
        } catch {
            setUseMicrofone(false);
        }
    };

    const stopRecording = () => {
        recorder?.stop();
        localStream?.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setLocalStream(null);
    };


    const handleSubmitSeries = async (e) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/lessons/series`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                return;
            }

            setSeries(data)

        } finally {
            setLoading(false);
        }
    };

    if (!lesson || !lesson.duration) return <h1>Урок не найден</h1>

    return (
        <div className="min-h-screen flex flex-col">

            {stage === 'intro' && (
                <div className="flex flex-col gap-8 my-20 max-w-md mx-auto items-center">
                    <Timer
                        minutes={lesson.duration}
                        size={240}
                        strokeWidth={3}
                        showControls={false}
                    />

                    <button
                        onClick={() => setStage('cards')}
                        className="action_btn w-full mt-20"
                    >
                        Начать урок
                    </button>
                </div>
            )}

            {stage === 'cards' && (
                <div className="flex flex-col w-full">
                    <div className="flex flex-row">
                        <h1 className="text-2xl font-semibold font-mono">Произносите</h1>

                        <div className="flex ml-auto">
                            <Timer
                                minutes={lesson.duration}
                                isStarted
                                size={120}
                                strokeWidth={3}
                                showControls
                                finish_callback={() => setStage('dialog')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {Object.entries(groupedCards).map(([title, group]) => (
                            <div key={title}>
                                <h2 className="font-semibold p-2">{title}</h2>

                                <div className="rounded-xl flex flex-col gap-3">
                                    {group.map((card) => (
                                        <p
                                            key={card.id}
                                            className="border whitespace-pre-line"
                                        >
                                            {card.text}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {stage === 'dialog' && (
                <div>
                    <div className="flex flex-row gap-3">
                        <h1 className="title">Диалог</h1>

                        <Tooltip children={<button>зачем?</button>}
                                 content="Для того чтобы вырабатывать автоматизацию при разговоре с реальным человеком, говоря звуки даже не задумываясь."/>

                    </div>

                    <div className="my-20 max-w-md mx-auto flex flex-col items-center gap-6">

                        <img
                            src={avatarRobotPng}
                            alt="AI"
                            className="rounded-xl mx-auto"
                        />

                        {!isUseMicrofone ? (
                            <button onClick={requestMicAndStartRecording} className="dialog_btn">
                                <p>Разрешить микрофон</p>
                                <img src={microfonePng} alt="mic"/>
                            </button>
                        ) : (
                            <button
                                onClick={isRecording ? stopRecording : requestMicAndStartRecording}
                                className="dialog_btn"
                            >
                                {isRecording ? 'Остановить запись' : 'Начать запись'}
                            </button>
                        )}

                    </div>
                </div>
            )}

            {stage === "finish" && (
                <div className="flex flex-col h-full min-h-screen">

                    {series && series.series_days > 0 && (
                        <Series series_day={series.series_days}/>
                    )}

                    <h1 className="title">Завершение</h1>

                    <button className="action_btn w-full items-center my-auto justify-center max-w-xl mx-auto"
                            onClick={handleSubmitSeries}>
                        Закончить урок
                    </button>
                </div>
            )}

        </div>
    );
}

export default Lesson;
