const tg = window.Telegram.WebApp;

export function useTelegram() {

    return {
        tg,
        userName: tg.initDataUnsafe?.user?.username
    }
}