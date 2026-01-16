import {useEffect, useState, FormEvent} from 'react';
import {API_URL} from "../../config.tsx";
import React from 'react';

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
        <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 bg-white rounded-2xl shadow-lg p-4 lg:sticky lg:top-6 lg:h-fit">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Admin Panel</h1>
                        <nav className="space-y-1">
                            {[
                                {id: 'lessons', label: 'Lessons', icon: '📚'},
                                {id: 'cards', label: 'Cards', icon: '🎴'},
                                {id: 'users', label: 'Users', icon: '👥'},
                                {id: 'dialogs', label: 'Dialogs', icon: '💬'}
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActive(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active === tab.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-5 md:p-6">
                                {active === 'lessons' && <LessonsPanel/>}
                                {active === 'cards' && <CardsPanel/>}
                                {active === 'users' && <UsersPanel/>}
                                {active === 'dialogs' && <DialogsPanel/>}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Modal Component
function Modal({isOpen, onClose, title, children}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black/40 transition-opacity"
                >
                    <div className="inline-block align-bottom bg-white rounded-2xl shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="px-6 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LessonsPanel(): JSX.Element {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [form, setForm] = useState<LessonForm>({duration: '', type: 'sh'});
    const [editing, setEditing] = useState<Lesson | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchLessons();
    }, []);

    async function fetchLessons() {
        const data = await fetch(`${API_URL}/lessons`).then(r => r.json());
        setLessons(data);
    }

    function handleEdit(lesson: Lesson) {
        setEditing(lesson);
        setForm({duration: lesson.duration.toString(), type: lesson.type});
        setShowModal(true);
    }

    function handleCreate() {
        setEditing(null);
        setForm({duration: '', type: 'sh'});
        setShowModal(true);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        const payload = {duration: Number(form.duration), type: form.type};
        const url = editing ? `${API_URL}/lessons/${editing.id}` : `${API_URL}/lessons/`;
        const method = editing ? 'PATCH' : 'POST';

        await fetch(url, {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        await fetchLessons();
        setShowModal(false);
        setForm({duration: '', type: 'sh'});
        setEditing(null);
    }

    async function remove(id: number) {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            await fetch(`${API_URL}/lessons/${id}`, {method: 'DELETE'});
            setLessons(prev => prev.filter(l => l.id !== id));
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Lessons Management</h2>
                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Lesson
                </button>
            </div>

            {/* Lessons Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {lessons.map(lesson => (
                        <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {lesson.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {lesson.duration} min
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lesson.type === 'sh' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {lesson.type}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(lesson)}
                                        className="text-indigo-600 hover:text-indigo-900 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => remove(lesson.id)}
                                        className="text-red-600 hover:text-red-900 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Edit */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editing ? 'Edit Lesson' : 'Create New Lesson'}
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={form.duration}
                            onChange={e => setForm({...form, duration: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter duration"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            value={form.type}
                            onChange={e => setForm({...form, type: e.target.value as LessonType})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                            <option value="sh">sh</option>
                            <option value="r">r</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            {editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function CardsPanel(): JSX.Element {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<CardForm>({lesson_id: '', title: '', text: ''});
    const [useFile, setUseFile] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/lessons/`).then(r => r.json()).then(setLessons);
    }, []);

    async function loadCards(id: string) {
        setSelectedLesson(id);
        if (!id) return setCards([]);
        const data: Card[] = await fetch(`${API_URL}/cards/${id}`).then(r => r.json());
        setCards(data);
    }

    function handleCreate() {
        if (!selectedLesson) {
            alert('Please select a lesson first');
            return;
        }
        setForm({lesson_id: selectedLesson, title: '', text: ''});
        setUseFile(false);
        setFile(null);
        setShowModal(true);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        const lessonIdNum = Number(form.lesson_id);

        if (useFile && file) {
            const text = await file.text();
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
            await Promise.all(lines.map(line => fetch(`${API_URL}/cards/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({lesson_id: lessonIdNum, title: form.title || '', text: line})
            })));
            await loadCards(form.lesson_id);
            setShowModal(false);
            return;
        }

        await fetch(`${API_URL}/cards/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lesson_id: lessonIdNum, title: form.title, text: form.text})
        });

        await loadCards(form.lesson_id);
        setShowModal(false);
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Cards Management</h2>
                <button
                    onClick={handleCreate}
                    disabled={!selectedLesson}
                    className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors ${selectedLesson
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Card
                </button>
            </div>

            {/* Lesson Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Lesson
                </label>
                <select
                    value={selectedLesson}
                    onChange={e => loadCards(e.target.value)}
                    className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                    <option value="">Choose a lesson</option>
                    {lessons.map(l => (
                        <option key={l.id} value={l.id}>
                            Lesson {l.id} - {l.duration}min ({l.type})
                        </option>
                    ))}
                </select>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map(card => (
                    <div
                        key={card.id}
                        className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-900 truncate">{card.title || 'No Title'}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ID: {card.id}
              </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3">{card.text}</p>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {cards.length === 0 && selectedLesson && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
                    <p className="text-gray-500">Start by adding your first card for this lesson</p>
                </div>
            )}

            {/* Create Card Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Card"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (Optional)
                        </label>
                        <input
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter card title"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={useFile}
                            onChange={e => setUseFile(e.target.checked)}
                            id="cards-use-file"
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="cards-use-file" className="text-sm text-gray-700">
                            Upload cards from file (.txt)
                        </label>
                    </div>

                    {useFile ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload File (One card per line)
                            </label>
                            <input
                                type="file"
                                accept=".txt"
                                onChange={e => setFile(e.target.files?.[0] ?? null)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Content
                            </label>
                            <textarea
                                value={form.text}
                                onChange={e => setForm({...form, text: e.target.value})}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                rows={4}
                                placeholder="Enter card content"
                                required={!useFile}
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Create Cards
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function UsersPanel(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<UserForm>({email: '', password: '', series_days: ''});

    function handleCreate() {
        setForm({email: '', password: '', series_days: ''});
        setShowModal(true);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        const payload: any = {email: form.email, password: form.password};
        if (form.series_days) payload.series_days = Number(form.series_days);

        await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        setShowModal(false);
        setForm({email: '', password: '', series_days: ''});
        alert('User created successfully!');
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add User
                </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Create New User</h3>
                        <p className="text-gray-600 text-sm">Add users to the system with their access credentials</p>
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New User"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="user@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Series Days (Optional)
                        </label>
                        <input
                            type="number"
                            value={form.series_days}
                            onChange={e => setForm({...form, series_days: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g., 30"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function DialogsPanel(): JSX.Element {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<DialogForm>({user_name: '', content: '', index: 0, lesson_id: 0});
    const [useFile, setUseFile] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/lessons/`).then(r => r.json()).then(setLessons);
    }, []);

    function handleCreate() {
        setForm({user_name: '', content: '', index: 0, lesson_id: 0});
        setUseFile(false);
        setFile(null);
        setShowModal(true);
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        if (!form.lesson_id) {
            alert('Please select a lesson');
            return;
        }

        if (useFile && file) {
            const text = await file.text();
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
            await Promise.all(lines.map((line, i) => {
                const parts = line.split(':');
                const userName = parts.shift() || '';
                const content = parts.join(':').trim();
                return fetch(`${API_URL}/dialogs/`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({user_name: userName, content, index: i, lesson_id: form.lesson_id})
                });
            }));
            setShowModal(false);
            alert(`Successfully created ${lines.length} dialog entries!`);
            return;
        }

        await fetch(`${API_URL}/dialogs/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });

        setShowModal(false);
        setForm({user_name: '', content: '', index: 0, lesson_id: 0});
        alert('Dialog created successfully!');
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dialogs Management</h2>
                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Dialog
                </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Manage Dialogs</h3>
                        <p className="text-gray-600 text-sm">Create individual dialog entries or bulk upload from file</p>
                    </div>
                </div>
            </div>

            {/* Create Dialog Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Dialog Entry"
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Lesson
                        </label>
                        <select
                            value={form.lesson_id}
                            onChange={e => setForm({...form, lesson_id: Number(e.target.value)})}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                        >
                            <option value={0}>Choose a lesson</option>
                            {lessons.map(l => (
                                <option key={l.id} value={l.id}>
                                    Lesson {l.id} - {l.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={useFile}
                            onChange={e => setUseFile(e.target.checked)}
                            id="dialogs-use-file"
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="dialogs-use-file" className="text-sm text-gray-700">
                            Upload dialogs from file (.txt)
                        </label>
                    </div>

                    {useFile ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload File (Format: "username: content")
                            </label>
                            <input
                                type="file"
                                accept=".txt"
                                onChange={e => setFile(e.target.files?.[0] ?? null)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                required={useFile}
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    value={form.user_name}
                                    onChange={e => setForm({...form, user_name: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter user name"
                                    required={!useFile}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm({...form, content: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    rows={3}
                                    placeholder="Enter dialog content"
                                    required={!useFile}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Index
                                </label>
                                <input
                                    type="number"
                                    value={form.index}
                                    onChange={e => setForm({...form, index: Number(e.target.value)})}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="0"
                                    required={!useFile}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            {useFile ? 'Upload Dialogs' : 'Create Dialog'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}