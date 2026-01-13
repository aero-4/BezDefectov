// src/components/lessons/Lesson.tsx
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {API_URL} from '../../config.tsx';
import Loader from '../loaders/Loader.tsx';
import Timer from '../components/Timer.tsx';
import avatarRobotPng from '../../assets/ai-avatar.png';
import microfonePng from '../../assets/microfone.png';
import Tooltip from "../buttons/Tooltip.tsx";
import Series from "../components/Series.tsx";
import {useAuth} from "../context/AuthContext.tsx";

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
    const {id} = useParams();
    const {user} = useAuth();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [stage, setStage] = useState<Stage>('finish');

    const [isUseMicrofone, setUseMicrofone] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [webrtcStatus, setWebrtcStatus] = useState('idle');
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const [series, setSeries] = useState<any>(null)
    const navigator = useNavigate();

    // WebSocket ref
    const wsRef = useRef<WebSocket | null>(null);

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

    useEffect(() => {
        if (stage !== 'dialog') return;

        const wsUrl = API_URL.replace(/^http/, 'ws') + '/lessons/dialog';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setWebrtcStatus('connected');
            console.log('ws open', wsUrl);
        };
        ws.onclose = (e) => {
            setWebrtcStatus('closed');
            console.log('ws closed', e);
        };
        ws.onerror = (e) => {
            setWebrtcStatus('error');
            console.error('ws error', e);
        };
        ws.onmessage = (ev) => {
            // Если сервер шлёт что-то — можно обработать здесь.
            // console.log('ws msg', ev.data);
        };

        wsRef.current = ws;

        return () => {
            try { ws.close(); } catch (e) { /* ignore */ }
            wsRef.current = null;
        };
    }, [stage]);

    if (loading || !lesson) return <Loader/>;

    const groupedCards = cards.reduce<Record<string, Card[]>>((acc, card) => {
        if (!acc[card.title]) acc[card.title] = [];
        acc[card.title].push(card);
        return acc;
    }, {});

    // helper: blob -> base64 (без metadata)
    const blobToBase64 = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result as string | null;
                if (!res) return reject(new Error('empty reader result'));
                const base64 = res.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    // replaced: start recording and stream chunks to websocket as base64
    const requestMicAndStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            setLocalStream(stream);
            setUseMicrofone(true);

            // prefer opus/webm where available
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                // fallback
                mimeType = '';
            }

            const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
            // accumulate for local preview/save only if needed
            const chunks: Blob[] = [];
            mr.ondataavailable = async (e: BlobEvent) => {
                if (!e.data || e.data.size === 0) return;

                // keep local copy (optional)
                chunks.push(e.data);

                // if websocket open - send base64
                const ws = wsRef.current;
                if (ws && ws.readyState === WebSocket.OPEN) {
                    try {
                        const base64 = await blobToBase64(e.data);
                        ws.send(JSON.stringify({
                            type: 'chunk',
                            payload: base64,
                        }));
                    } catch (err) {
                        console.error('blob->base64 error', err);
                    }
                } else {
                    console.warn('ws not open, chunk dropped or buffered locally');
                }
            };
            mr.onstop = () => {
                // store local chunks if needed
                setAudioChunks(chunks.slice());
            };

            // timeslice — отправка чанков каждые 250ms
            mr.start(250);

            setRecorder(mr);
            setIsRecording(true);
        } catch (err) {
            console.error('getUserMedia error', err);
            setUseMicrofone(false);
        }
    };

    const stopRecording = () => {
        try {
            recorder?.stop();
        } catch (e)

        try {
            localStream?.getTracks().forEach((t) => t.stop());
        } catch (e)

        try {
            const ws = wsRef.current;
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'end' }));
            }
        } catch (e)

        setIsRecording(false);
        setLocalStream(null);
    };


    const handleSubmitSeries = async (e) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/lessons/series`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include"
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                return;
            }

            setSeries(data)

            const timer = setTimeout(() => {
                navigator(-1)
            }, 3000)

            return () => clearTimeout(timer);


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
                                minutes={1}
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
                                <h2 className="font-semibold p-1">{title}</h2>

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

                        <Tooltip children={<button className="my-auto text-sm text-center justify-center">зачем?</button>}
                                 content="Очень важно чтобы вы могли выработать автоматизацию при разговоре, говоря звуки даже не задумываясь."/>

                    </div>

                    <div className="my-20 max-w-md mx-auto flex flex-col items-center gap-6">

                        <img
                            src={avatarRobotPng}
                            alt="AI"
                            className="size-100"
                        />

                        <h1>Алиса</h1>


                        {!isUseMicrofone ? (
                            <button onClick={requestMicAndStartRecording} className="dialog_btn">
                                <img src={microfonePng} alt="mic" className="size-5 my-auto"/>
                            </button>
                        ) : (
                            <button
                                onClick={isRecording ? stopRecording : requestMicAndStartRecording}
                                className="dialog_btn w-full"
                            >
                                {isRecording ? 'Остановить запись' : 'Начать запись'}
                                <img src={microfonePng} alt="mic" className="size-5 my-auto"/>

                            </button>
                        )}
                    </div>


                </div>
            )}

            {stage === "finish" && (
                <div className="flex flex-col h-full min-h-screen">
                    {series && series.series_days !== user.series_days && (
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
