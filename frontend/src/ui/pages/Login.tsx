import React, { useState } from 'react';
import SwitchWithCross from "../switches/Switch.tsx";
import {API_URL} from "../../config.tsx";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "", submit: "" });
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const next = { email: "", password: "", submit: "" };
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) next.email = "Email обязателен";
        else if (!emailRe.test(email)) next.email = "Неверный формат email";

        if (!password) next.password = "Пароль обязателен";
        else if (password.length < 6) next.password = "Пароль должен содержать не менее 6 символов";

        setErrors(next);
        return !next.email && !next.password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors((s) => ({ ...s, submit: "" }));

        if (!validate()) return;

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = data?.message || data?.error || `Ошибка входа: ${res.status}`;
                setErrors((s) => ({ ...s, submit: msg }));
                return;
            }

            if (props.onLogin) props.onLogin(data);
        } catch (err) {
            setErrors((s) => ({ ...s, submit: "Сетевая ошибка. Попробуйте позже." }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col gap-3">
                <label className="font-semibold text-xl" htmlFor="email">EMAIL</label>
                <input
                    id="email"
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                    <p id="email-error" className="text-red-600 text-sm" role="alert">{errors.email}</p>
                )}

                <label className="font-semibold text-xl" htmlFor="password">ПАРОЛЬ</label>
                <input
                    id="password"
                    className={`input ${errors.password ? 'border-red-500' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                    <p id="password-error" className="text-red-600 text-sm" role="alert">{errors.password}</p>
                )}

                <SwitchWithCross checked={showPassword}
                                 onChange={setShowPassword}
                                 label={"ПОКАЗАТЬ ПАРОЛЬ"} />

                {errors.submit && (
                    <p className="text-red-600 text-sm mt-2" role="alert" aria-live="polite">{errors.submit}</p>
                )}

                <button
                    type="submit"
                    className="action_btn my-20"
                    disabled={loading}
                >
                    {'Войти'}
                </button>
            </div>
        </form>
    );
}
