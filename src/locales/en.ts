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
      letsGetStarted: "Let's get started!",
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      refresh: 'Refresh',
      search: 'Search',
      create: 'Create',
      save: 'Save',
      next: 'Next',
      continue: 'Continue',
      addWorkspace: 'Add workspace',
      editWorkspace: 'Edit workspace',
      selectWorkspace: 'Select workspace',
      deleteWorkspace: 'Delete workspace',
      resetPassword: 'Reset password',
      back: '« Back',
      resend: 'Resend',
      resendIn: 'Resend in {timer}',
      sendFeedback: 'Send feedback',
    },
    label: {
      all: 'All',
      version: 'Version',
      whatIsYourName: "What's your name?",
      email: 'Email',
      code: 'Code',
      settings: 'Settings',
      password: 'Password',
      confirmPassword: 'Confirm password',
      workspaceName: 'Workspace name',
      font: 'Font',
      language: 'Language',
      theme: 'Theme',
      oled: 'OLED',
      term: 'Term',
      newCard: 'New card',
      results: 'Results',
      editing: 'Editing',
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
      on: 'On',
      off: 'Off',
    },
    lang: {
      ru: 'Русский',
      en: 'English',
      auto: 'Auto',
    },
  },
  auth: {
    login: {
      enterEmail: 'Enter your email',
      enterPassword: 'Enter password',
    },
    register: {
      createAccount: 'Create an account',
      youAreNewHere:
        "Looks like you're new here. Let’s create an account with your email {email}",
      setPassword: 'Set a password',
    },
    verifyEmail: {
      checkMailbox: 'Check your mailbox',
      checkMailboxCaption:
        "We sent a confirmation code to {email}. Check your spam folder if you don't see it.",
      youAreAllSet:
        'Your account has been successfully created',
      congratulations: 'Congratulations!',
    },
    forgotPassword: {
      checkMailbox: 'Check your mailbox',
      checkMailboxCaption:
        "We sent a confirmation code to {email}. Check your spam folder if you don't see it.",
    },
    resetPassword: {
      setNewPassword: 'Set a new password',
      passwordUpdated: 'Password updated!',
    },
    passwordHint: 'At least 8 characters',
    error: {
      nameRequired: 'Please enter your name',
      emailRequired: 'Please enter your email',
      passwordRequired: 'Please enter a password',
      passwordRequiredWithLink:
        'Please enter a password. {link}?',
      passwordsDoNotMatch: 'Passwords do not match',
      invalidOrExpiredCode: 'Invalid or expired code',
      tooManyRequests:
        'Too many requests. Please wait a moment and try again.',
      wrongPassword: 'The password is wrong. {link}?',
      passwordTooShort:
        'Password must be at least 8 characters',
      confirmPasswordRequired:
        'Please confirm your password',
      emailInvalid: 'Please enter a valid email address',
      emailAlreadyExists:
        'An account with this email already exists',
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
