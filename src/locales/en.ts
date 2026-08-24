export default {
  appName: 'RippleMate',
  general: {
    date: {
      today: 'Today',
      yesterday: 'Yesterday',
    },
    action: {
      ok: 'OK',
      yes: 'Yes',
      signup: 'Sign up',
      login: 'Log in',
      logout: 'Log out',
      letsGo: "Let's go!",
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      refresh: 'Refresh',
      search: 'Search',
      create: 'Create',
      save: 'Save',
      addWorkspace: 'Add workspace',
      editWorkspace: 'Edit workspace',
      selectWorkspace: 'Select workspace',
      deleteWorkspace: 'Delete workspace',
    },
    label: {
      all: 'All',
      whatIsYourName: "What's your name?",
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      workspaceName: 'Workspace name',
      font: 'Font',
      language: 'Language',
      theme: 'Theme',
      term: 'Term',
      results: 'Results',
      name: 'Name',
    },
    error: {
      somethingWentWrong: 'Something went wrong',
    },
    theme: {
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    },
    state: {
      loading: 'Loading...',
    },
    lang: {
      ru: 'Русский',
      en: 'English',
      auto: 'Auto',
    },
  },
  auth: {
    loginHeader: 'Log in to your account',
    signupHeader: 'Sign up',
    alreadyHaveAnAccount: 'Already have an account?',
    doNotHaveAnAccount: "Don't have an account?",
    passwordLength: 'At least 8 characters',
    validation: {
      nameRequired: 'Please enter your name',
      emailRequired: 'Please enter your email',
      emailInvalid: 'Please enter a valid email address',
      passwordRequired: 'Please enter a password',
      wrongPassword:
        'It seems you entered the wrong password',
      invalidCredentials: 'Incorrect email or password',
      passwordTooShort:
        'Password must be at least 8 characters',
      confirmPasswordRequired:
        'Please confirm your password',
      passwordsDoNotMatch: 'Passwords do not match',
    },
  },
  main: {
    noCardsYetTitle: 'It’s empty',
    noCardsYetSubtitle:
      'Add your first card to get started',
    noCardsFoundTitle: 'No cards found',
    noCardsFoundSubtitle: 'Try a different search',
  },
  flow: {
    answer: {
      easy: 'Easy',
      good: 'Good',
      hard: 'Hard',
      forgotCard: 'I forgot this card',
    },
  },
  dialog: {
    card: {
      delete: {
        title: 'Delete card?',
        caption: '"{term}" will be permanently deleted.',
      },
    },
    category: {
      delete: {
        title: 'Delete category?',
        caption:
          '"{name}" and all its cards will be permanently deleted.',
      },
      new: {
        title: 'New category',
      },
      edit: {
        title: 'Edit category',
      },
      error: {
        alreadyExists:
          'Category with this name already exists',
      },
    },
    workspace: {
      delete: {
        title: 'Delete workspace?',
        caption:
          '"{name}" and everything inside it will be permanently deleted.',
      },
      new: {
        title: 'New workspace',
      },
      edit: {
        title: 'Edit workspace',
      },
      error: {
        alreadyExists:
          'Workspace with this name already exists',
      },
    },
  },
}
