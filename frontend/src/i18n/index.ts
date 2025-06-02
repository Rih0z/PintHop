import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻訳リソース
const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',
        email: 'Email',
        password: 'Password',
        username: 'Username',
        required: 'Required',
        optional: 'Optional'
      },
      auth: {
        login: 'Sign In',
        register: 'Sign Up',
        logout: 'Sign Out',
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Sign in to your PintHop account',
        registerTitle: 'Join the Community',
        registerSubtitle: 'Start your beer hopping journey today',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        createAccount: 'Create Account',
        signInHere: 'Sign in here',
        signUpHere: 'Sign up here',
        rememberMe: 'Remember me',
        confirmPassword: 'Confirm Password',
        emailAddress: 'Email Address',
        chooseUsername: 'Choose a username',
        createPassword: 'Create a password',
        confirmYourPassword: 'Confirm your password',
        termsAndConditions: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        agreeToTerms: 'By creating an account, you agree to our',
        and: 'and',
        validation: {
          emailRequired: 'Email is required',
          emailInvalid: 'Please enter a valid email address',
          passwordRequired: 'Password is required',
          passwordTooShort: 'Password must be at least 8 characters',
          passwordPattern: 'Password must contain at least one letter and one number',
          passwordsNotMatch: 'Passwords do not match',
          usernameRequired: 'Username is required',
          usernamePattern: 'Username must be 3-20 characters (letters, numbers, underscore only)',
          usernameNotAvailable: 'Username is already taken',
          emailNotAvailable: 'Email is already registered',
          invalidCredentials: 'Invalid credentials',
          registrationFailed: 'Registration failed',
          loginFailed: 'Login failed',
          loginRequired: 'Please login to continue'
        },
        status: {
          signingIn: 'Signing in...',
          creatingAccount: 'Creating account...',
          checkingAvailability: 'Checking availability...',
          available: 'Available',
          taken: 'Taken',
          alreadyRegistered: 'Already registered'
        }
      },
      nav: {
        dashboard: 'Dashboard',
        map: 'Map',
        timeline: 'Timeline',
        profile: 'Profile',
        settings: 'Settings',
        language: 'Language'
      },
      map: {
        peopleHere: 'people here',
        friendsHere: 'friends here',
        viewOnMap: 'View on Map'
      },
      checkin: {
        title: 'Check In',
        checkIn: 'Check In',
        checkingIn: 'Checking in...',
        success: 'Successfully checked in!',
        failed: 'Check-in failed',
        estimatedDuration: 'How long will you stay?',
        message: 'Message',
        messagePlaceholder: 'What are you drinking?',
        sharePublicly: 'Share publicly'
      },
      timeline: {
        justNow: 'just now',
        minutesAgo: '{{count}} minutes ago',
        hoursAgo: '{{count}} hours ago',
        daysAgo: '{{count}} days ago',
        todayRoute: "Today's Route",
        totalStops: '{{count}} stops',
        allActivity: 'All Activity',
        friendsOnly: 'Friends',
        myActivity: 'My Activity',
        noActivity: 'No activity yet',
        checkInNow: 'Check In Now',
        checkedInAt: 'checked in at',
        viewOnMap: 'View on Map'
      },
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',
        email: 'Email',
        password: 'Password',
        username: 'Username',
        required: 'Required',
        optional: 'Optional',
        minutes: 'minutes',
        hour: 'hour',
        hours: 'hours',
        website: 'Website',
        call: 'Call',
        loadMore: 'Load More'
      },
      dashboard: {
        welcome: 'Welcome to PintHop',
        subtitle: 'Discover serendipitous encounters through beer hopping',
        quickActions: 'Quick Actions',
        checkinAtBrewery: 'Check in at Brewery',
        findNearbyBreweries: 'Find Nearby Breweries',
        viewFriendsActivity: 'View Friends Activity',
        recentActivity: 'Recent Activity',
        trendingBreweries: 'Trending Breweries',
        friendsActivity: 'Friends Activity',
        noActivity: 'No recent activity',
        noFriends: 'No friends activity yet',
        seeAll: 'See all'
      },
      app: {
        title: 'PintHop',
        tagline: 'Serendipitous encounters through beer hopping'
      }
    }
  },
  ja: {
    translation: {
      common: {
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        save: '保存',
        delete: '削除',
        edit: '編集',
        confirm: '確認',
        email: 'メールアドレス',
        password: 'パスワード',
        username: 'ユーザー名',
        required: '必須',
        optional: '任意'
      },
      auth: {
        login: 'ログイン',
        register: 'アカウント作成',
        logout: 'ログアウト',
        loginTitle: 'おかえりなさい',
        loginSubtitle: 'PintHopアカウントにサインイン',
        registerTitle: 'コミュニティに参加',
        registerSubtitle: '今日からビアホッピングの旅を始めましょう',
        forgotPassword: 'パスワードを忘れた方',
        noAccount: 'アカウントをお持ちでない方',
        hasAccount: '既にアカウントをお持ちの方',
        createAccount: 'アカウントを作成',
        signInHere: 'こちらからサインイン',
        signUpHere: 'こちらからサインアップ',
        rememberMe: 'ログイン情報を保存',
        confirmPassword: 'パスワード確認',
        emailAddress: 'メールアドレス',
        chooseUsername: 'ユーザー名を選択',
        createPassword: 'パスワードを作成',
        confirmYourPassword: 'パスワードを確認',
        termsAndConditions: '利用規約',
        privacyPolicy: 'プライバシーポリシー',
        agreeToTerms: 'アカウントを作成することで、以下に同意したものとみなされます：',
        and: 'および',
        validation: {
          emailRequired: 'メールアドレスは必須です',
          emailInvalid: '有効なメールアドレスを入力してください',
          passwordRequired: 'パスワードは必須です',
          passwordTooShort: 'パスワードは8文字以上で入力してください',
          passwordPattern: 'パスワードには文字と数字を含めてください',
          passwordsNotMatch: 'パスワードが一致しません',
          usernameRequired: 'ユーザー名は必須です',
          usernamePattern: 'ユーザー名は3-20文字（英数字・アンダースコアのみ）',
          usernameNotAvailable: 'このユーザー名は既に使用されています',
          emailNotAvailable: 'このメールアドレスは既に登録されています',
          invalidCredentials: 'ユーザー名またはパスワードが間違っています',
          registrationFailed: 'アカウント作成に失敗しました',
          loginFailed: 'ログインに失敗しました',
          loginRequired: 'ログインしてください'
        },
        status: {
          signingIn: 'サインイン中...',
          creatingAccount: 'アカウント作成中...',
          checkingAvailability: '利用可能性を確認中...',
          available: '利用可能',
          taken: '使用済み',
          alreadyRegistered: '登録済み'
        }
      },
      nav: {
        dashboard: 'ダッシュボード',
        map: 'マップ',
        timeline: 'タイムライン',
        profile: 'プロフィール',
        settings: '設定',
        language: '言語'
      },
      map: {
        peopleHere: '人がここにいます',
        friendsHere: '人の友達がここにいます',
        viewOnMap: 'マップで見る'
      },
      checkin: {
        title: 'チェックイン',
        checkIn: 'チェックイン',
        checkingIn: 'チェックイン中...',
        success: 'チェックインしました！',
        failed: 'チェックインに失敗しました',
        estimatedDuration: 'どのくらい滞在しますか？',
        message: 'メッセージ',
        messagePlaceholder: '何を飲んでいますか？',
        sharePublicly: '公開で共有'
      },
      timeline: {
        justNow: 'たった今',
        minutesAgo: '{{count}}分前',
        hoursAgo: '{{count}}時間前',
        daysAgo: '{{count}}日前',
        todayRoute: '今日のルート',
        totalStops: '{{count}}箇所',
        allActivity: 'すべて',
        friendsOnly: '友達のみ',
        myActivity: '自分のみ',
        noActivity: 'まだアクティビティがありません',
        checkInNow: '今すぐチェックイン',
        checkedInAt: 'にチェックイン',
        viewOnMap: 'マップで見る'
      },
      common: {
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        save: '保存',
        delete: '削除',
        edit: '編集',
        confirm: '確認',
        email: 'メールアドレス',
        password: 'パスワード',
        username: 'ユーザー名',
        required: '必須',
        optional: '任意',
        minutes: '分',
        hour: '時間',
        hours: '時間',
        website: 'ウェブサイト',
        call: '電話',
        loadMore: 'もっと見る'
      },
      dashboard: {
        welcome: 'PintHopへようこそ',
        subtitle: 'ビアホッピングを通じて偶然の出会いを発見',
        quickActions: 'クイックアクション',
        checkinAtBrewery: 'ブルワリーでチェックイン',
        findNearbyBreweries: '近くのブルワリーを探す',
        viewFriendsActivity: '友達のアクティビティを見る',
        recentActivity: '最近のアクティビティ',
        trendingBreweries: 'トレンディングブルワリー',
        friendsActivity: '友達のアクティビティ',
        noActivity: '最近のアクティビティはありません',
        noFriends: '友達のアクティビティはまだありません',
        seeAll: 'すべて表示'
      },
      app: {
        title: 'PintHop',
        tagline: 'ビアホッピングで偶然の出会いを'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;