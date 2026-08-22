import type en from './en'

const ru: typeof en = {
  appName: 'RippleMate',
  general: {
    date: {
      today: 'Сегодня',
      yesterday: 'Вчера',
    },
    action: {
      signup: 'Создать аккаунт',
      login: 'Войти',
      logout: 'Выйти',
      letsGo: 'Поехали!',
      edit: 'Редактировать',
      delete: 'Удалить',
      refresh: 'Обновить',
      search: 'Поиск',
      addWorkspace: 'Дообавить пространство',
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
      term: 'Термин',
      results: 'Найдено',
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
}

export default ru
