import React from 'react';

function Footer(props) {
    return (
        <div className="flex flex-col gap-3 p-9 border-t border-t-gray-100">

            <a href="/" className="link">На главную</a>
            <a href="/faq" className="link">О нас</a>
            <a href="/privacy" className="link">Пользовательское соглашение</a>

            <span className="link">Все права зарезервированы БезДефектов 2026</span>

        </div>
    );
}

export default Footer;
