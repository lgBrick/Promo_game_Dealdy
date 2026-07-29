class PromoGame {
    constructor() {
        this.app = document.getElementById('app');
        this.overlay = document.getElementById('blink-overlay');

        this.views = {
            1: document.getElementById('view-main'),
            2: document.getElementById('view-macbook'),
            3: document.getElementById('view-windows')
        };

        this.macbookHitbox = document.querySelector('.macbook-hitbox');
        this.windowsHitbox = document.querySelector('.windows-screen');
        this.macbookView = document.getElementById('view-macbook');
        this.windowsFullView = document.getElementById('view-windows');

        this.isTransitioning = false;

        this.initEventListeners();

        // Добавляем вызов ресайза
        this.initResize();
    }

    // --- НОВЫЙ БЛОК ДЛЯ МАСШТАБИРОВАНИЯ ---
    initResize() {
        this.resizeApp(); // Подгоняем при старте
        window.addEventListener('resize', () => this.resizeApp()); // Подгоняем при изменении окна
    }

    resizeApp() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // ВАЖНО: Те же размеры, что и в CSS!
        const baseWidth = 2390;
        const baseHeight = 1792;

        // Math.max заставляет контейнер вести себя ровно как background-size: cover
        const scale = Math.max(windowWidth / baseWidth, windowHeight / baseHeight);

        this.app.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    // --------------------------------------

    initEventListeners() {
        // --- Состояние 1 ---
        // Клик по левому ноутбуку -> Переход в Стейт 2
        this.macbookHitbox.addEventListener('click', () => {
            this.changeState(2);
        });

        // Клик по правому ноутбуку (черный экран) -> Переход в Стейт 3
        this.windowsHitbox.addEventListener('click', () => {
            this.changeState(3);
        });

        // --- Состояние 2 ---
        // Клик везде, кроме самого экрана макбука -> Возврат в Стейт 1
        this.macbookView.addEventListener('click', (event) => {
            // Если клик пришелся именно на обертку view, а не на safezone (сам экран)
            if (event.target === this.macbookView) {
                this.changeState(1);
            }
        });

        // --- Состояние 3 ---
        // Клик по черному экрану Windows -> JS заглушка
        this.windowsFullView.addEventListener('click', () => {
            console.log('[System]: Запрос на загрузку ОС Windows перехвачен.');
            alert('Действие Windows перехвачено. Здесь будет ваша логика.');

            // Если захочешь, чтобы после клика возвращало на главный экран, раскомментируй строку ниже:
            // this.changeState(1);
        });
    }

    /**
     * Эффект "моргания" и смена состояния
     * @param {number} newState - Номер состояния (1, 2 или 3)
     */
    changeState(newState) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // 1. Закрываем глаза (появление черного экрана)
        this.overlay.classList.add('active');

        // Ждем 400мс (время CSS транзишена), пока экран не станет полностью черным
        setTimeout(() => {

            // 2. Меняем фоновую картинку через класс контейнера
            this.app.className = `state-${newState}`;

            // 3. Выключаем все слои и включаем нужный
            Object.values(this.views).forEach(view => view.classList.remove('active'));
            this.views[newState].classList.add('active');

            // 4. Открываем глаза (исчезновение черного экрана)
            this.overlay.classList.remove('active');

            // Снимаем блокировку кликов после завершения анимации
            setTimeout(() => {
                this.isTransitioning = false;
            }, 400);

        }, 400);
    }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new PromoGame();
});