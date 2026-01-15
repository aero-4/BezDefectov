import {useEffect, useState} from 'react';
import profilePng from "../../assets/profile.png";
import fireActivePng from "../../assets/fire-active.png";
import fireDisactivePng from "../../assets/fire-disabled.png";
import {API_URL} from "../../config.tsx";
import Loader from "../loaders/Loader.tsx";

export interface User {
    id: number;
    created_at: string; // ISO строка
    updated_at?: string | null;
    user_name?: string | null;
    email: string;
    hashed_password: string;
    series_days?: number | null;
}

const Profile: React.FC = () => {
    const mockUser: User = {
        id: 1,
        created_at: new Date().toISOString(),
        updated_at: null,
        user_name: "username",
        email: "demo@example.com",
        hashed_password: "mocked",
        series_days: 4,
    };
    const [user, setUser] = useState<User | null>(mockUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchMe() {
            try {
                setLoading(true);
                const res = await fetch(API_URL + '/users/me', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: "include"
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (mounted) setUser(data as User);
            } catch (err: any) {
                if (mounted) setError(err.message ?? 'Ошибка при загрузке данных');
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchMe();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) return <Loader/>

    const displayName = user.user_name ?? user.email;
    const series = user.series_days ?? 0;
    const fireImg = series > 0 ? fireActivePng : fireDisactivePng;

    return (
        <div className="flex flex-col items-center justify-center mx-auto gap-6 max-w-md font-medium">
            <div className="flex items-center gap-4">
                <div className="flex flex-col gap-3 items-center">
                    <img src={profilePng} alt="profile" className="w-20 h-20 rounded-full object-cover"/>

                    <div className="flex items-center gap-2 items-center">
                        <span className="font-medium">{displayName}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 border w-full">
                <p className="mb-auto my-12">Серия уроков</p>

                <div className="flex flex-row gap-2 ml-auto p-3 items-center">
                    <h1 className="text-3xl font-bold font-montserrat">{series}</h1>

                    <img src={fireImg}
                         alt={series > 0 ? "active fire" : "inactive fire"} className="w-8 h-8 "/>
                </div>
            </div>
        </div>
    );
};

export default Profile;
