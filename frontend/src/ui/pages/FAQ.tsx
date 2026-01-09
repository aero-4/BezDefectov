import React from 'react';

function Faq(props) {
    return (
        <div className="flex flex-col gap-12">

            <h1 className="font-mono text-xl">О нас</h1>

            <div className="flex flex-col gap-9">
                <h2 className="font-semibold">Мы команда энтузиастов которая
                    хочет помочь людям с дефектами речи.</h2>

                <h2 className="font-semibold">Данный сервис работает как обучающие материалы для изучения и проработки различных дефектов. </h2>

            </div>

        </div>
    );
}

export default Faq;