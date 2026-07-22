import type en from './en'

const ru: typeof en = {
  appName: 'RippleMate',
  lang: 'РУС',
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
  general: {
    action: {
      signup: 'Создать аккаунт',
      login: 'Войти',
      logout: 'Выйти',
      letsGo: 'Поехали!',
      edit: 'Редактировать',
      delete: 'Удалить',
      refresh: 'Обновить',
      addWorkspace: 'Дообавить пространство',
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
    },
    error: {
      somethingWentWrong: 'Что-то пошло не так',
    },
  },
}

export default ru
