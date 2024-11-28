/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const btn = document.querySelector('.sidebar-toggle');
    // Проверяем, существует ли кнопка
    if (btn) {
      btn.addEventListener('click', function () {
        // Переключаем классы sidebar-open и sidebar-collapse
        document.body.classList.toggle('sidebar-open');
        document.body.classList.toggle('sidebar-collapse');
      });
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const login = document.querySelector('.menu-item_login');
    const register = document.querySelector('.menu-item_register');
    const logout = document.querySelector('.menu-item_logout');

    // Проверяем, существуют ли элементы меню
    if (login) {
      login.addEventListener('click', () => {
        const modalLogin = App.getModal('login');
        if (modalLogin) modalLogin.open();
      });
    }

    if (register) {
      register.addEventListener('click', () => {
        const modalRegister = App.getModal('register');
        if (modalRegister) modalRegister.open();
      });
    }

    if (logout) {
      logout.addEventListener('click', (e) => {
        e.preventDefault();
        User.logout((err, response) => {
          if (response.success) {
            App.setState('init');
            User.current(); // Обновляем информацию о текущем пользователе
          }
        });
      });
    }
  }
}