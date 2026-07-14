import type en from './en'

const ru: typeof en = {
  appName: 'RippleMate',
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
      letsGo: 'Поехали!',
    },
    label: {
      whatIsYourName: 'Как вас зовут?',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
    },
  },
}

export default ru
