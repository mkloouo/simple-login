import React from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {loginScreenName} from '../../app.json';

interface DashboardScreenProps {
  username: string;
  componentId: string;
}

export default class DashboardScreen extends React.Component<
  DashboardScreenProps
> {
  constructor(props: DashboardScreenProps) {
    super(props);

    this.onLogoutButtonPressed = this.onLogoutButtonPressed.bind(this);
  }

  onLogoutButtonPressed() {
    Navigation.setRoot({
      root: {
        component: {
          name: loginScreenName,
          passProps: {
            clearSession: true,
          },
        },
      },
    });
  }

  render() {
    return (
      <SafeAreaView testID="DashboardScreen" style={s.container}>
        <Text>Hi, {this.props.username}</Text>
        <Button title="Logout" onPress={this.onLogoutButtonPressed} />
      </SafeAreaView>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
