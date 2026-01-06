import React from 'react';

function Footer(props) {
    return (
        <div className="flex flex-col gap-4 p-8 border-t border-t-gray-200">

            <a href="/" className="link">На главную</a>
            <a href="/faq" className="link">О нас</a>
            <a href="/privacy" className="link">Пользовательское соглашение</a>

            <span className="link">@Все права зарезервированы 2025-2026</span>

        </div>
    );
}

export default Footer;
