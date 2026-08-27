import type en from './en'

const ru: typeof en = {
  appName: 'RippleMate',
  general: {
    date: {
      today: 'Сегодня',
      yesterday: 'Вчера',
    },
    action: {
      ok: 'ОК',
      yes: 'Да',
      signup: 'Создать аккаунт',
      login: 'Войти',
      logout: 'Выйти',
      letsGo: 'Поехали!',
      edit: 'Редактировать',
      delete: 'Удалить',
      cancel: 'Отмена',
      refresh: 'Обновить',
      search: 'Поиск',
      create: 'Создать',
      save: 'Сохранить',
      addWorkspace: 'Новое пространство',
      editWorkspace: 'Ред. пространство',
      selectWorkspace: 'Выбрать пространтсво',
      deleteWorkspace: 'Удалить пространство',
    },
    label: {
      all: 'Все',
      whatIsYourName: 'Как вас зовут?',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      workspaceName: 'Имя пространства',
      font: 'Шрифт',
      language: 'Язык',
      theme: 'Тема',
      oled: 'OLED',
      term: 'Термин',
      newCard: 'Новая карточка',
      results: 'Найдено',
      editing: 'Изменение',
      name: 'Название',
    },
    error: {
      somethingWentWrong: 'Что-то пошло не так',
    },
    theme: {
      auto: 'Авто',
      light: 'Светлая',
      dark: 'Тёмная',
    },
    state: {
      loading: 'Загрузка...',
      on: 'Вкл.',
      off: 'Выкл.',
    },
    lang: {
      ru: 'Русский',
      en: 'English',
      auto: 'Авто',
    },
  },
  auth: {
    loginHeader: 'Войдите в аккаунт',
    signupHeader: 'Создайте аккаунт',
    alreadyHaveAnAccount: 'Уже есть аккаунт?',
    doNotHaveAnAccount: 'Нет аккаунта?',
    passwordLength: 'Не менее 8 символов',
    validation: {
      nameRequired: 'Введите имя',
      emailRequired: 'Введите email',
      emailInvalid: 'Введите корректный email',
      passwordRequired: 'Введите пароль',
      wrongPassword: 'Похоже, вы ввели неверный пароль',
      invalidCredentials: 'Неверный email или пароль',
      passwordTooShort:
        'Пароль должен содержать не менее 8 символов',
      confirmPasswordRequired: 'Подтвердите пароль',
      passwordsDoNotMatch: 'Пароли не совпадают',
    },
  },
  main: {
    noCardsYetTitle: 'Пусто',
    noCardsYetSubtitle: 'Добавьте карточку, чтобы начать',
    noCardsFoundTitle: 'Не найдено',
    noCardsFoundSubtitle: 'Попробуйте изменить запрос',
  },
  flow: {
    answer: {
      easy: 'Легко',
      good: 'Хорошо',
      hard: 'Сложно',
      forgotCard: 'Я забыл эту карточку',
    },
  },
  dialog: {
    card: {
      delete: {
        title: 'Удалить карточку?',
        caption: '"{term}" будет удалён навсегда.',
      },
    },
    category: {
      delete: {
        title: 'Удалить категорию?',
        caption:
          '"{name}" и все его карточки будут удалены навсегда.',
      },
      new: {
        title: 'Новая категория',
      },
      edit: {
        title: 'Редактировать категорию',
      },
      error: {
        alreadyExists:
          'Категория с таким названием уже существует',
      },
    },
    workspace: {
      delete: {
        title: 'Удалить пространство?',
        caption:
          '"{name}" и все, что в нем находится, будет безвозвратно удалено.',
      },
      new: {
        title: 'Новое пространство',
      },
      edit: {
        title: 'Редактировать пространство',
      },
      error: {
        alreadyExists:
          'Пространство с таким названием уже существует',
      },
    },
  },
}

export default ru
