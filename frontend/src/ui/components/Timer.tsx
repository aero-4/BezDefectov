import React, { useEffect, useRef, useState } from 'react';

export type TimerProps = {
    minutes?: number;
    isStarted?: boolean;
    isStopped?: boolean;
    finish_callback?: () => void;
    size?: number;
    strokeWidth?: number;
    allowEdit?: boolean;
    className?: string;
};

const pad = (n: number) => n.toString().padStart(2, '0');

const Timer: React.FC<TimerProps> = ({
                                         minutes = 25,
                                         isStarted = false,
                                         isStopped = false,
                                         finish_callback,
                                         size = 160,
                                         strokeWidth = 8,
                                         className = '',
                                     }) => {
    const [totalSeconds, setTotalSeconds] = useState<number>(Math.max(0, Math.floor(minutes) * 60));
    const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSeconds);
    const [running, setRunning] = useState<boolean>(isStarted && !isStopped && totalSeconds > 0);
    const intervalRef = useRef<number | null>(null);
    const finishedRef = useRef(false);

    useEffect(() => {
        const secs = Math.max(0, Math.floor(minutes) * 60);
        setTotalSeconds(secs);
        setRemainingSeconds(secs);
        finishedRef.current = false;
        if (isStopped) {
            setRunning(false);
        } else if (isStarted && secs > 0) {
            setRunning(true);
        } else {
            setRunning(false);
        }
    }, [minutes, isStarted, isStopped]);

    useEffect(() => {
        if (running && remainingSeconds > 0) {
            intervalRef.current = window.setInterval(() => {
                setRemainingSeconds((s) => {
                    if (s <= 1) {
                        window.clearInterval(intervalRef.current ?? undefined);
                        intervalRef.current = null;
                        finishedRef.current = true;
                        setRunning(false);
                        if (finish_callback) finish_callback();
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [running]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
    const dashOffset = circumference * (1 - progress);

    const [inputMinutes, setInputMinutes] = useState<string>(String(Math.max(0, Math.floor(minutes))));

    const applyInput = () => {
        const m = Math.max(0, Math.floor(Number(inputMinutes) || 0));
        const secs = m * 60;
        setTotalSeconds(secs);
        setRemainingSeconds(secs);
        finishedRef.current = false;
        setRunning(false);
    };

    const start = () => {
        if (remainingSeconds > 0) setRunning(true);
    };
    const pause = () => setRunning(false);
    const reset = () => {
        setRemainingSeconds(totalSeconds);
        finishedRef.current = false;
        setRunning(false);
    };

    const minutesPart = Math.floor(remainingSeconds / 60);
    const secondsPart = remainingSeconds % 60;

    return (
        <div className={`inline-flex flex-col items-center ${className}`} style={{ width: size }}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="block">
                    <g transform={`translate(${size / 2}, ${size / 2})`}>
                        <circle
                            r={radius}
                            cx={0}
                            cy={0}
                            strokeWidth={strokeWidth}
                            className="opacity-20"
                            stroke="currentColor"
                            fill="none"
                            style={{ color: '#e2e8f0' }}
                        />
                        <circle
                            r={radius}
                            cx={0}
                            cy={0}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={dashOffset}
                            transform="rotate(-90)"
                            style={{ color: running ? '#ef4444' : '#9ca3af', transition: 'stroke-dashoffset 0.3s linear' }}
                        />
                    </g>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-semibold">{pad(minutesPart)}:{pad(secondsPart)}</div>
                        <div className="text-xs text-gray-500">мин:сек</div>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <button
                    onClick={start}
                    className="px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
                    aria-label="start timer"
                    disabled={running || remainingSeconds === 0}
                >
                    Начать
                </button>

            </div>

        </div>
    );
};

export default Timer;
