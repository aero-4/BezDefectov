import {useEffect, useState, FormEvent} from 'react';
import {API_URL} from "../../config.tsx";


type LessonType = 'sh' | 'r';

interface Lesson {
    id: number;
    duration: number;
    type: LessonType;
}

interface LessonForm {
    duration: string;
    type: LessonType;
}

interface Card {
    id: number;
    lesson_id: number;
    title: string;
    text: string;
}

interface CardForm {
    lesson_id: string;
    title: string;
    text: string;
}

interface UserForm {
    email: string;
    password: string;
    series_days: string;
}

interface DialogForm {
    user_name: string;
    content: string;
    index: number;
    lesson_id: number;
}

export default function Admin(): JSX.Element {
    const [active, setActive] = useState<'lessons' | 'cards' | 'users' | 'dialogs'>('lessons');

    return (
        <div className="flex flex-col gap-3 min-h-screen bg-gray-50 p-4 md:p-8">
            <h1 className="text-xl">Admin Panel</h1>
            <div className="mx-auto bg-white rounded-2xl shadow p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <nav className="md:w-56">
                        <div className="hidden md:block space-y-2">
                            {['lessons', 'cards', 'users', 'dialogs'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActive(tab as any)}
                                    className={`w-full text-left px-3 py-2 rounded-xl ${active === tab ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="md:hidden flex gap-2">
                            {['lessons', 'cards', 'users', 'dialogs'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActive(tab as any)}
                                    className={`flex-1 py-2 rounded-lg text-sm ${active === tab ? 'bg-indigo-600 text-white' : 'border'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </nav>

                    <main className="flex-1">
                        {active === 'lessons' && <LessonsPanel/>}
                        {active === 'cards' && <CardsPanel/>}
                        {active === 'users' && <UsersPanel/>}
                        {active === 'dialogs' && <DialogsPanel/>}
                    </main>
                </div>
            </div>
        </div>
    );
}

function LessonsPanel(): JSX.Element {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [form, setForm] = useState<LessonForm>({duration: '', type: 'sh'});
    const [editing, setEditing] = useState<Lesson | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/lessons`, ).then(r => r.json()).then(setLessons);
    }, []);

    async function submit(e: FormEvent) {
        e.preventDefault();
        const payload = {duration: Number(form.duration), type: form.type};
        const url = editing ? `${API_URL}/lessons/${editing.id}` : `${API_URL}/lessons/`;
        const method = editing ? 'PATCH' : 'POST';

        await fetch(url, {method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        const data: Lesson[] = await fetch(`${API_URL}/lessons/`).then(r => r.json());
        setLessons(data);
        setEditing(null);
        setForm({duration: '', type: 'sh'});
    }

    async function remove(id: number) {
        await fetch(`${API_URL}/lessons/${id}`, {method: 'DELETE'});
        setLessons(prev => prev.filter(l => l.id !== id));
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Lessons</h2>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                <input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="border p-2 rounded" placeholder="Duration"/>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value as LessonType})} className="border p-2 rounded">
                    <option value="sh">sh</option>
                    <option value="r">r</option>
                </select>
                <button className="bg-indigo-600 text-white rounded px-4 py-2">{editing ? 'Update' : 'Create'}</button>
            </form>

            <table className="w-full text-sm">
                <thead>
                <tr className="border-b">
                    <th>ID</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {lessons.length > 0 && lessons.map(l => (
                    <tr key={l.id} className="border-b">
                        <td>{l.id}</td>
                        <td>{l.duration}</td>
                        <td>{l.type}</td>
                        <td className="space-x-2">
                            <button onClick={() => setEditing(l)} className="border px-2 py-1 rounded">Edit</button>
                            <button onClick={() => remove(l.id)} className="border px-2 py-1 rounded">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

function CardsPanel(): JSX.Element {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [form, setForm] = useState<CardForm>({lesson_id: '', title: '', text: ''});

    useEffect(() => {
        fetch(`${API_URL}/lessons/`).then(r => r.json()).then(setLessons);
    }, []);

    async function loadCards(id: string) {
        setForm(f => ({...f, lesson_id: id}));
        const data: Card[] = await fetch(`${API_URL}/cards/${id}`).then(r => r.json());
        setCards(data);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        const payload = {lesson_id: Number(form.lesson_id), title: form.title, text: form.text};
        await fetch(`${API_URL}/cards/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        loadCards(form.lesson_id);
        setForm({lesson_id: form.lesson_id, title: '', text: ''});
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Cards</h2>
            <select onChange={e => loadCards(e.target.value)} className="border p-2 rounded mb-4">
                <option value="">Select lesson</option>
                {lessons.map(l => <option key={l.id} value={l.id}>{l.id}</option>)}
            </select>

            <form onSubmit={submit} className="space-y-2 mb-4">
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded w-full" placeholder="Title"/>
                <textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="border p-2 rounded w-full"/>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
            </form>

            <ul className="space-y-2">
                {cards.map(c => (
                    <li key={c.id} className="border p-2 rounded">
                        <div className="font-medium">{c.title}</div>
                        <div className="text-sm text-gray-600">{c.text}</div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function UsersPanel(): JSX.Element {
    const [form, setForm] = useState<UserForm>({email: '', password: '', series_days: ''});

    async function submit(e: FormEvent) {
        e.preventDefault();
        const payload: any = {email: form.email, password: form.password};
        if (form.series_days) payload.series_days = Number(form.series_days);
        await fetch(`${API_URL}/users/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
        setForm({email: '', password: '', series_days: ''});
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border p-2 rounded" placeholder="Email"/>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="border p-2 rounded" placeholder="Password"/>
                <input type="number" value={form.series_days} onChange={e => setForm({...form, series_days: e.target.value})} className="border p-2 rounded" placeholder="Series days"/>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded md:col-span-3">Create user</button>
            </form>
        </section>
    );
}


function DialogsPanel(): JSX.Element {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [form, setForm] = useState<DialogForm>({
        user_name: '',
        content: '',
        index: 0,
        lesson_id: 0
    });

    useEffect(() => {
        fetch(`${API_URL}/lessons/`)
            .then(r => r.json())
            .then(setLessons);
    }, []);

    async function submit(e: FormEvent) {
        e.preventDefault();
        const payload = {
            user_name: form.user_name,
            content: form.content,
            index: form.index,
            lesson_id: form.lesson_id
        };
        await fetch(`${API_URL}/dialogs/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        setForm({user_name: '', content: '', index: 0, lesson_id: 0});
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Dialogs</h2>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                    type="text"
                    value={form.user_name}
                    onChange={e => setForm({...form, user_name: e.target.value})}
                    className="border p-2 rounded"
                    placeholder="User name"
                />
                <input
                    type="text"
                    value={form.content}
                    onChange={e => setForm({...form, content: e.target.value})}
                    className="border p-2 rounded"
                    placeholder="Content"
                />
                <input
                    type="number"
                    value={form.index}
                    onChange={e => setForm({...form, index: Number(e.target.value)})}
                    className="border p-2 rounded"
                    placeholder="Index"
                />
                <select
                    value={form.lesson_id}
                    onChange={e => setForm({...form, lesson_id: Number(e.target.value)})}
                    className="border p-2 rounded"
                >
                    <option value={0}>Select lesson</option>
                    {lessons.map(l => (
                        <option key={l.id} value={l.id}>
                            {l.id}
                        </option>
                    ))}
                </select>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded md:col-span-3">
                    Create dialog
                </button>
            </form>
        </section>
    );
}