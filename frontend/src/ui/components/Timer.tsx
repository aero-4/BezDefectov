import { useEffect, useRef, useState } from 'react';

export type TimerProps = {
    minutes?: number;
    isStarted?: boolean;
    isStopped?: boolean;
    finish_callback?: () => void;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showControls?: boolean;
};

const pad = (n: number) => n.toString().padStart(2, '0');

const Timer: React.FC<TimerProps> = ({
                                         minutes,
                                         isStarted = false,
                                         isStopped = false,
                                         finish_callback,
                                         size = 160,
                                         strokeWidth = 8,
                                         className = '',
                                         showControls = false,
                                     }) => {
    const [totalSeconds, setTotalSeconds] = useState(Math.max(0, Math.floor(minutes) * 60));
    const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
    const [running, setRunning] = useState(isStarted && !isStopped && totalSeconds > 0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const secs = Math.max(0, Math.floor(minutes) * 60);
        setTotalSeconds(secs);
        setRemainingSeconds(secs);

        if (isStopped) setRunning(false);
        else if (isStarted && secs > 0) setRunning(true);
    }, [minutes, isStarted, isStopped]);

    useEffect(() => {
        if (!running) return;

        intervalRef.current = window.setInterval(() => {
            setRemainingSeconds((s) => {
                if (s <= 1) {
                    clearInterval(intervalRef.current!);
                    setRunning(false);
                    finish_callback?.();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = totalSeconds ? remainingSeconds / totalSeconds : 0;
    const dashOffset = circumference * (1 - progress);

    const minutesPart = Math.floor(remainingSeconds / 60);
    const secondsPart = remainingSeconds % 60;

    return (
        <div className={`flex flex-col items-center ${className}`} style={{ width: size }}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size}>
                    <g transform={`translate(${size / 2}, ${size / 2})`}>
                        <circle
                            r={radius}
                            strokeWidth={strokeWidth}
                            stroke="#d1d5db"
                            fill="none"
                        />
                        <circle
                            r={radius}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            stroke="#111827"
                            fill="none"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={dashOffset}
                            transform="rotate(-90)"
                        />
                    </g>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center font-semibold">
                    {pad(minutesPart)}:{pad(secondsPart)}
                </div>
            </div>

            {showControls && remainingSeconds > 0 && (
                <button
                    onClick={() => setRunning((v) => !v)}
                    className="mt-2 p-2 rounded-full border border-gray-300"
                >
                    {running ? (
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <rect x="3" y="2" width="3" height="12" fill="currentColor" />
                            <rect x="10" y="2" width="3" height="12" fill="currentColor" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <polygon points="4,2 13,8 4,14" fill="currentColor" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
};

export default Timer;
