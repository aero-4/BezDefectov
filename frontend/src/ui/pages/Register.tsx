import React, { useState } from 'react';
import {API_URL} from "../../config.tsx";
import SwitchWithCross from "../switches/Switch.tsx";

const emailRegex = /^\S+@\S+\.\S+$/;



export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [consent, setConsent] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const passwordType = showPassword ? 'text' : 'password';

    function validate() {
        const e = {};
        if (!email) e.email = 'Email обязателен.';
        else if (!emailRegex.test(email)) e.email = 'Неверный формат email.';

        if (!password) e.password = 'Пароль обязателен.';
        else if (password.length < 8) e.password = 'Пароль должен содержать не менее 8 символов.';

        if (!repeatPassword) e.repeatPassword = 'Повторите пароль.';
        else if (password !== repeatPassword) e.repeatPassword = 'Пароли не совпадают.';

        if (!consent) e.consent = 'Требуется согласие на обработку персональных данных.';

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        setServerError('');

        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(API_URL + '/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
                credentials: "include"
            });

            if (res.ok) {
                window.location.href = '/profile';
                return;
            }

            let msg = 'Регистрация не удалась.';
            try {
                const json = await res.json();
                if (json?.message) msg = json.message;
                else if (typeof json === 'string') msg = json;
            } catch (err) {
                const text = await res.text();
                if (text) msg = text;
            }

            setServerError(msg);
        } catch (err) {
            setServerError('Сетевая ошибка. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="justify-center max-w-xl items-center mx-auto" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-3">
                <label className="font-semibold text-xl" htmlFor="email">EMAIL</label>
                <input
                    id="email"
                    className="input "
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                />
                {errors.email && <div className="text-sm text-red-600">{errors.email}</div>}

                <label className="font-semibold text-xl" htmlFor="password">ПАРОЛЬ</label>
                <input
                    id="password"
                    className="input"
                    type={passwordType}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                />
                {errors.password && <div className="text-sm text-red-600">{errors.password}</div>}

                <label className="font-semibold text-xl" htmlFor="repeat_password">ПОВТОРИТЕ ПАРОЛЬ</label>
                <input
                    id="repeat_password"
                    className="input"
                    type={passwordType}
                    name="repeat_password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    aria-invalid={!!errors.repeatPassword}
                />
                {errors.repeatPassword && <div className="text-sm text-red-600">{errors.repeatPassword}</div>}

                <div className="flex flex-col gap-3 mt-6">
                    <SwitchWithCross checked={showPassword} onChange={setShowPassword} label={"ПОКАЗАТЬ ПАРОЛЬ"} />
                    <SwitchWithCross
                        checked={consent}
                        onChange={setConsent}
                        label="ДАЮ СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ"
                    />
                </div>
                {errors.consent && <div className="text-sm text-red-600">{errors.consent}</div>}

                {serverError && <div className="text-sm text-red-700 font-semibold">{serverError}</div>}

                <button
                    type="submit"
                    className={`action_btn my-20  ${(!consent || loading) ? 'cursor-not-allowed' : ''}`}
                    disabled={!consent || loading}
                >
                    {'Создать аккаунт'}
                </button>
            </div>
        </form>
    );
}
