/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if (response && response.success) {
        // Сбрасываем форму
        this.element.reset();
        // Устанавливаем состояние пользователя как авторизованного
        App.setState('user-logged');
        // Закрываем модальное окно
        App.getModal('login').close();
      } else if (response && response.error) {
        // Если есть ошибка, выводим её
        alert(response.error);
      }
    });
  }
}