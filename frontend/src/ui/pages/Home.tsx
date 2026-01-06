import React from 'react';
import homePhoto from "../../assets/home.png";


function Home() {
    return (
        <div className="flex flex-col gap-17">
            <div className="flex flex-row gap-3 my-9">
                <div className="flex flex-col gap-9">
                    <h1 className="text-4xl font-bold">Идеальное произношение - близко</h1>

                    <p>
                        Попробуйте исправить свои дефекты с помощью нашего сервиса совершенно бесплатно!
                    </p>

                    <div>
                        <button className="action_btn p-2"
                                onClick={() => document.location.assign("/register")}>
                            Попробовать
                        </button>
                    </div>
                </div>

                <div className="items-center justify-center my-auto">
                    <img className="rounded-3xl"
                         src={homePhoto}
                         alt="banner"/>
                </div>


            </div>


            <div className="grid grid-cols-2 gap-6">
                <div className="border text-black">

                    <span className="text-[180px] text-[#0022FF] font-bold">1</span>

                    Составим план уроков за вас. Вы можете проходить их в любое время
                </div>
                <div className="border text-black translate-y-24">

                    <span className="text-[180px] text-[#0022FF] font-bold">2</span>

                    Проходите уроки каждый день и создайте новую привычку
                </div>
                <div className="border text-black translate-y-10">

                    <span className="text-[180px] text-[#0022FF] font-bold">3</span>

                    Закрепляйте новые умения вместе с ИИ партнером
                </div>
                <div className="border text-black translate-y-32">

                    <span className="text-[180px] text-[#0022FF] font-bold">4</span>

                    Получайте новые рекомандации каждый день от наших логопедов
                </div>

            </div>

            <div className="my-24 p-4">
                <button className="flex action_btn mx-auto p-5 w-full text-lg text-center rounded"
                        onClick={() => document.location.assign("/register")}>
                    Начать
                </button>
            </div>
        </div>


    );
}

export default Home;
