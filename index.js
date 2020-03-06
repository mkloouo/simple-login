import {Navigation} from 'react-native-navigation';
import {SplashScreen, LoginScreen, DashboardScreen} from './src/screens';
import {
  splashScreenName,
  loginScreenName,
  dashboardScreenName,
} from './app.json';

Navigation.registerComponent(splashScreenName, () => SplashScreen);
Navigation.registerComponent(loginScreenName, () => LoginScreen);
Navigation.registerComponent(dashboardScreenName, () => DashboardScreen);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: splashScreenName,
      },
    },
  });
});
