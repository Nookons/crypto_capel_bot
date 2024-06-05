import React from 'react';
import './Main.css'

const Main = () => {
    return (
        <div className={"Display"}>
            <div>
                <img src="https://crypto-stonks.com/wp-content/uploads/2024/05/blum-1024x576.jpg" alt=""/>
                <h3>Bloom</h3>
                <p>Децентралізований обмін всередині Telegram за допомогою міні-додатку</p>
                <button>Розпочати гру</button>
            </div>

            <div>
                <img src="https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66432956d91ca37bce56369b_664329d97e0c9b54987eac34/scale_1200" alt=""/>
                <h3>WormFare</h3>
                <p>Це криптогра з реальним впливом! Наші черв'ячки не просто говорять - вони діють!</p>
                <button>Розпочати гру</button>
            </div>

            <div>
                <img src="https://cryptorussia.ru/wp-content/uploads/2024/06/tronix.jpg" alt=""/>
                <h3>TRONIX APP</h3>
                <p>Це інноваційна гра в Telegram, яка дозволяє користувачам заробляти криптовалюту, виконуючи різні завдання та брати участь в міні-іграх.</p>
                <button>Розпочати гру</button>
            </div>
        </div>
    );
};

export default Main;