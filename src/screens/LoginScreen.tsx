import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  View,
  Button,
  TextInput,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import users from '../apis/users';
import {setItem, deleteItem} from 'react-native-sensitive-info';
import {dashboardScreenName} from '../../app.json';

interface LoginScreenProps {
  componentId: string;
  clearSession?: boolean;
}

interface LoginScreenState {
  email: string;
  password: string;
  rememberMeChecked: boolean;
  errorMessage: string;
}

export default class LoginScreen extends React.Component<
  LoginScreenProps,
  LoginScreenState
> {
  private emailRx = /[A-z0-9_]+@([A-z0-9]+\.)+([A-z0-9]+)/;

  constructor(props: LoginScreenProps) {
    super(props);

    if (props.clearSession) {
      deleteItem('session', {});
    }

    // email: john@smith.co
    // pw: AgentSmith85

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      rememberMeChecked: false,
    };

    this.onEmailChanged = this.onEmailChanged.bind(this);
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onRememberMeChecked = this.onRememberMeChecked.bind(this);

    this.onLoginButtonPressed = this.onLoginButtonPressed.bind(this);
  }

  clearerrorMessage() {
    if (this.state.errorMessage.length !== 0) {
      this.setState({errorMessage: ''});
    }
  }

  onEmailChanged(text: string) {
    this.clearerrorMessage();
    this.setState({email: text});
  }

  onPasswordChanged(text: string) {
    this.clearerrorMessage();
    this.setState({password: text});
  }

  onRememberMeChecked(value: boolean) {
    this.setState({rememberMeChecked: value});
  }

  validateLoginForm() {
    if (this.state.email.length === 0) {
      throw new Error('Email field must not be empty');
    }

    if (!this.state.email.match(this.emailRx)) {
      throw new Error('Email is not valid');
    }

    if (this.state.password.length === 0) {
      throw new Error('Password field must not be empty');
    }

    if (this.state.password.length <= 5) {
      throw new Error('Password field must be more than 6 symbols');
    }
  }

  onLoginButtonPressed() {
    try {
      this.validateLoginForm();
    } catch (e) {
      return this.setState({errorMessage: e.message});
    }
    users
      .login(this.state.email, this.state.password)
      .then((session: any) => {
        if (this.state.rememberMeChecked) {
          setItem('session', session, {});
        }

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
      })
      .catch(err => {
        console.log(err);
        this.setState({errorMessage: 'Invalid credentials'});
      });
  }

  render() {
    return (
      <SafeAreaView testID="LoginScreen" style={s.container}>
        {this.state.errorMessage.length > 0 && (
          <Text testID="LoginScreen.errorMessage" style={s.errorMessageText}>
            {this.state.errorMessage}
          </Text>
        )}
        <View style={s.inputContainer}>
          <Text style={s.field}>Email:</Text>
          <TextInput
            testID="LoginScreen.emailInput"
            style={s.field}
            value={this.state.email}
            onChangeText={this.onEmailChanged}
            placeholder="Enter email"
          />
        </View>
        <View style={s.inputContainer}>
          <Text style={s.field}>Password:</Text>
          <TextInput
            testID="LoginScreen.passwordInput"
            style={s.field}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={this.onPasswordChanged}
            placeholder="Enter password"
          />
        </View>
        <View style={s.switchContainer}>
          <Text style={s.field}>Remeber me</Text>
          <Switch
            testID="LoginScreen.rememberMeSwitch"
            style={s.switch}
            value={this.state.rememberMeChecked}
            onValueChange={this.onRememberMeChecked}
          />
        </View>
        <Button
          testID="LoginScreen.loginButton"
          title="Login"
          onPress={this.onLoginButtonPressed}
        />
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
  field: {
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 20,
  },
  errorMessageText: {
    color: 'red',
  },
});
