/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
 class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Элемент не существует");
    }

    this.element = element;
    this.lastOptions = null; // Инициализация lastOptions
    this.currentAccName = ''; // Инициализация currentAccName
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccButton = this.element.querySelector(".remove-account");
    removeAccButton.addEventListener("click", () => {
      this.removeAccount();
    });

    this.element.addEventListener("click", (e) => {
      const removeTransactionButton = e.target.closest(".transaction__remove");
      if (!removeTransactionButton) return;

      this.removeTransaction(removeTransactionButton.dataset.id);
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диалоговое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const resultConfirm = confirm(
        `Вы действительно хотите удалить счет "${this.currentAccName}"?`
      );
      if (resultConfirm) {
        const accData = { id: this.lastOptions.account_id };
        Account.remove(accData, (e, response) => {
          if (response && response.success) {
            App.widgets.accounts.update();
            this.clear(); // Очистка страницы после удаления
          } else {
            alert("Ошибка при удалении счета");
          }
        });
      }
    } else {
      alert("Прежде, чем удалять счет, выберите его!");
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждения действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const resultConfirm = confirm(
      `Вы действительно хотите удалить эту транзакцию?`
    );
    if (resultConfirm) {
      const transactionData = { id };
      Transaction.remove(transactionData, (e, response) => {
        if (response && response.success) {
          this.update();
          App.widgets.accounts.update();
        } else {
          alert("Ошибка при удалении транзакции");
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (e, response) => {
        if (response && response.success) {
          this.currentAccName = response.data.name; // Сохраняем название счета
          this.renderTitle(this.currentAccName);
        } else {
          alert("Ошибка при получении информации о счете");
        }
      });

      Transaction.list(options, (e, response) => {
        if (response && response.success) {
          this.renderTransactions(response.data);
        } else {
          alert("Ошибка при получении списка транзакций");
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null; // Сбрасываем lastOptions
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitle = this.element.querySelector(".content-title");
    if (contentTitle) {
      contentTitle.textContent = name;
    } else {
      console.error("Элемент заголовка не найден");
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateFormat = new Date(date);
    const month = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ];
    return `${dateFormat.getDate()} ${month[dateFormat.getMonth()]} ${dateFormat.getFullYear()} г. в ${dateFormat.getHours()}:${dateFormat.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    if (!item.type) {
      console.error("Тип транзакции отсутствует");
      return '';
    }
    return `
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <!-- дата -->
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
            <!--  сумма -->
            ${item.sum.toLocaleString()} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <!-- в data-id нужно поместить id -->
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentElement = this.element.querySelector(".content");
    if (contentElement) {
      contentElement.innerHTML = ""; // Очистка контейнера перед добавлением новых элементов
      data.forEach((item) => {
        contentElement.innerHTML += this.getTransactionHTML(item);
      });
    } else {
      console.error("Элемент контента не найден");
    }
  }
}