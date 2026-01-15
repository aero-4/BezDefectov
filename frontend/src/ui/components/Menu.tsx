import BurgerMenu from "../buttons/BurgerMenu";
import {useAuth} from "../context/AuthContext.tsx";

function Menu({ onClose }) {
    const {isAuthenticated} = useAuth();

    return (
        <div className="fixed inset-0 bg-white z-50 ">

            <div className="relative h-24">
                <h1 className="p-2 absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono">
                    Меню
                </h1>

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <BurgerMenu onClick={onClose} />
                </div>
            </div>

            <nav className="flex flex-col gap-15 p-24 text-lg font-bold">
                {isAuthenticated ? (
                    <>
                        <a href="/profile" className="link" onClick={onClose}>Профиль</a>
                        <a href="/types" className="link" onClick={onClose}>Уроки</a>
                        <a href="/faq" className="link" onClick={onClose}>О нас</a>
                        <a href="/logout" className="link" onClick={onClose}>Выйти</a>
                    </>
                ) : (
                    <>
                        <a href="/register" className="link" onClick={onClose}>Регистрация</a>
                        <a href="/login" className="link" onClick={onClose}>Войти</a>
                        <a href="/faq" className="link" onClick={onClose}>О нас</a>
                    </>
                )}

            </nav>

        </div>
    );
}

export default Menu;
