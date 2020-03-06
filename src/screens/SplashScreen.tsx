import React from 'react';

import {getItem} from 'react-native-sensitive-info';
import {Navigation} from 'react-native-navigation';
import {dashboardScreenName, loginScreenName} from '../../app.json';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import users from '../apis/users';

const SplashScreen = () => {
  function onSessionExists(session: string) {
    users.getUsername(session).then((username: string) =>
      Navigation.setRoot({
        root: {
          component: {
            name: dashboardScreenName,
            passProps: {
              username,
            },
          },
        },
      }),
    );
  }

  function onSessionDoesNotExist() {
    Navigation.setRoot({
      root: {
        component: {
          name: loginScreenName,
        },
      },
    });
  }

  React.useEffect(() => {
    getItem('session', {})
      .then(session => {
        if (session) {
          onSessionExists(session);
        }
        throw session;
      })
      .catch(onSessionDoesNotExist);
  });

  return (
    <SafeAreaView style={s.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
