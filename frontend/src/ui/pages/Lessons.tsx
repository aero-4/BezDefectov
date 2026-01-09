import React, { useEffect, useState } from 'react';
import Loader from '../loaders/Loader';
import { API_URL } from '../../config.tsx';
import { useParams } from 'react-router-dom';

type Lesson = {
    id: number;
    created_at: string;
    updated_at: string;
    duration: number;
    type: string;
};

export default function Lessons() {
    const mockLessons: Lesson[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        created_at: new Date(Date.now() - Math.random() * 1e10).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 1e9).toISOString(),
        duration: Math.floor(Math.random() * 120) + 10,
        type: 'test',
    }));

    const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
    const [loading, setLoading] = useState(true);
    const { type } = useParams<{ type: string }>();

    if (!type) return <span>Не знаю такого типа уроков</span>;

    console.log(lessons)

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch(API_URL + `/lessons/types/${type}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data: Lesson[] = await res.json();

                if (!mounted)
                    return;

                setLessons(data);
            } catch (e) {
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [type]);

    if (loading) return <Loader />;
    if (!lessons || lessons === []) return;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-mono text-2xl">Уроки</h1>

            <div className="flex flex-wrap gap-4 my-3 p-3">
                {lessons.map((lesson, index) => (
                    <a
                        key={lesson.id}
                        href={`/lesson/${lesson.id}`}
                        className="lesson"
                    >
                        {index + 1}
                    </a>
                ))}
            </div>
        </div>
    );
}
