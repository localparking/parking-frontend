module.exports = () => {
  const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || ''

  return {
    name: '동네파킹',
    slug: 'townparking',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'townparking',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#00C800',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.townparking.app',
      usesAppleSignIn: true,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ['townparking', 'com.townparking.app'],
          },
          {
            CFBundleURLSchemes: [`kakao${KAKAO_NATIVE_APP_KEY}`],
            CFBundleURLName: 'Kakao',
          },
        ],
        LSApplicationQueriesSchemes: ['kakaokompassauth', 'kakaolink', 'kakaoplus'],
        NSAppTransportSecurity: {
          NSExceptionDomains: {
            'map.naver.com': {
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSIncludesSubdomains: true,
            },
            'map.naver.net': {
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSIncludesSubdomains: true,
            },
          },
        },
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#00C800',
      },
      package: 'com.townparking.app',
      intentFilters: [
        {
          action: 'VIEW',
          category: ['DEFAULT', 'BROWSABLE'],
          data: { scheme: 'town-parking' },
        },
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      [
        'expo-network-security-config',
        {
          networkSecurityConfig: './assets/configs/network_security_config.xml',
          enable: true,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
          },
        },
      ],
      [
        '@react-native-kakao/core',
        {
          nativeAppKey: KAKAO_NATIVE_APP_KEY,
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#00C800',
        },
      ],
      'expo-web-browser',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: '이 앱은 주차장 찾기 서비스를 위해 현재 위치 정보가 필요합니다.',
        },
      ],
      'expo-apple-authentication',
      'expo-font',
      'expo-router',
    ],
    experiments: {
      typedRoutes: true,
    },
  }
}
