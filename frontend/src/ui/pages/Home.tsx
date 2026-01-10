import React from 'react';
import homePhoto from "../../assets/home.png";
import arrowPng from "../../assets/arrow.png";
import calendarPng from "../../assets/calendar.png";

function Home() {
    return (
        <div className="flex flex-col gap-18">
            <div className="flex flex-col md:flex-row gap-5 my-9">
                <div className="flex flex-col gap-9">
                    <h1 className="text-4xl font-bold font-mono">Идеальное произношение - близко</h1>

                    <p className="font-sans font-semibold">
                        Попробуйте исправить свои дефекты с помощью нашего сервиса совершенно бесплатно!
                    </p>


                    <div>
                        <button className="action_btn"
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


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold font-montserrat">
                <div className="border text-black">
                    <div className="flex flex-row">
                        <span className="flex text-[180px] text-[#0022FF] font-bold">1</span>
                    </div>

                    <p>Составим план уроков за вас. Вы можете проходить их в любое время</p>


                </div>
                <div className="border text-black md:translate-y-24">

                    <span className="text-[180px] text-[#0022FF] font-bold">2</span>

                    <p>Проходите уроки каждый день и создайте новую привычку</p>
                </div>
                <div className="border text-black md:translate-y-10">

                    <span className="text-[180px] text-[#0022FF] font-bold">3</span>
                    <p>Закрепляйте новые умения вместе с ИИ партнером</p>

                </div>
                <div className="border text-black md:translate-y-32">

                    <span className="text-[180px] text-[#0022FF] font-bold">4</span>
                    <p>Получайте новые рекомандации каждый день от наших логопедов</p>

                </div>

            </div>

            <div className="my-24 p-4">
                <button className="flex action_btn mx-auto p-5 w-full text-lg text-center rounded"
                        onClick={() => document.location.assign("/register")}>
                    <img src={arrowPng} alt="arrow" className="w-8"/>
                    Начать
                </button>
            </div>
        </div>


    );
}

export default Home;
