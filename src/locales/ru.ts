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
      letsGetStarted: 'Начать!',
      edit: 'Редактировать',
      delete: 'Удалить',
      cancel: 'Отмена',
      refresh: 'Обновить',
      search: 'Поиск',
      create: 'Создать',
      save: 'Сохранить',
      next: 'Далее',
      continue: 'Продолжить',
      addWorkspace: 'Новое пространство',
      editWorkspace: 'Ред. пространство',
      selectWorkspace: 'Выбрать пространтсво',
      deleteWorkspace: 'Удалить пространство',
      resetPassword: 'Сбросить пароль',
      back: '« Назад',
      resend: 'Отправить еще раз',
      resendIn: 'Отправить ещё раз через {timer}',
    },
    label: {
      all: 'Все',
      whatIsYourName: 'Как вас зовут?',
      email: 'Email',
      code: 'Код',
      settings: 'Настройки',
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
    login: {
      enterEmail: 'Введите свой email',
      enterPassword: 'Введите пароль',
    },
    register: {
      createAccount: 'Создайте аккаунт',
      youAreNewHere:
        'Похоже, вы здесь впервые. Давайте создадим аккаунт на вашу почту {email}',
      setPassword: 'Придумайте пароль',
    },
    verifyEmail: {
      checkMailbox: 'Проверьте свою почту',
      checkMailboxCaption:
        'Мы отправили код подтверждения на {email}. Если не видите письмо, проверьте папку "Спам".',
      youAreAllSet: 'Ваш аккаунт успешно создан',
      congratulations: 'Поздравляем!',
    },
    forgotPassword: {
      checkMailbox: 'Проверьте свою почту',
      checkMailboxCaption:
        'Мы отправили код подтверждения на {email}. Если не видите письмо, проверьте папку "Спам".',
    },
    resetPassword: {
      setNewPassword: 'Новый пароль',
      passwordUpdated: 'Пароль изменен!',
    },
    passwordHint: 'Не менее 8 символов',
    error: {
      nameRequired: 'Введите имя',
      emailRequired: 'Введите email',
      passwordRequired: 'Введите пароль',
      passwordRequiredWithLink: 'Введите пароль. {link}?',
      passwordsDoNotMatch: 'Пароли не совпадают',
      invalidOrExpiredCode: 'Неверный или истекший код',
      tooManyRequests:
        'Слишком много запросов. Подождите немного и попробуйте снова.',
      wrongPassword: 'Неверный пароль. {link}?',
      passwordTooShort:
        'Пароль должен содержать не менее 8 символов',
      confirmPasswordRequired: 'Подтвердите пароль',
      emailInvalid: 'Введите корректный email',
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
