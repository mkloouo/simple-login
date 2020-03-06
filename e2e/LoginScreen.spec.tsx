describe('LoginScreen', () => {
  beforeEach(async () => {
    await device.clearKeychain();
    await device.launchApp({newInstance: true});
  });

  afterEach(async () => {
    await device.terminateApp();
  });

  it('should show login screen', async () => {
    await expect(element(by.id('LoginScreen'))).toBeVisible();
  });

  it('should show email text input element', async () => {
    await expect(element(by.id('LoginScreen.emailInput'))).toBeVisible();
  });

  it('should show password text input element', async () => {
    await expect(element(by.id('LoginScreen.passwordInput'))).toBeVisible();
  });

  it('should show empty email and password fields', async () => {
    await expect(element(by.id('LoginScreen.emailInput'))).toHaveText('');
    await expect(element(by.id('LoginScreen.passwordInput'))).toHaveText('');
  });

  it('should show rememeber me switch element', async () => {
    await expect(element(by.id('LoginScreen.rememberMeSwitch'))).toBeVisible();
  });

  it('should show login button', async () => {
    await expect(element(by.id('LoginScreen.loginButton'))).toBeVisible();
  });

  it('should not display error message', async () => {
    await expect(element(by.id('LoginScreen.errorMessage'))).toNotExist();
  });

  describe('Email validation', () => {
    it('should check if empty email', async () => {
      await element(by.id('LoginScreen.loginButton')).tap();

      await expect(element(by.id('LoginScreen.errorMessage'))).toBeVisible();
      await expect(element(by.id('LoginScreen.errorMessage'))).toHaveText(
        'Email field must not be empty',
      );
    });

    it('should check if invalid email', async () => {
      await element(by.id('LoginScreen.emailInput')).typeText(
        'i am invalid email',
      );
      await element(by.id('LoginScreen.loginButton')).tap();

      await expect(element(by.id('LoginScreen.errorMessage'))).toBeVisible();
      await expect(element(by.id('LoginScreen.errorMessage'))).toHaveText(
        'Email is not valid',
      );
    });
  });

  describe('Password validation', () => {
    beforeEach(async () => {
      await element(by.id('LoginScreen.emailInput')).typeText('detox@wix.com');
    });

    it('should check if empty password', async () => {
      await element(by.id('LoginScreen.loginButton')).tap();

      await expect(element(by.id('LoginScreen.errorMessage'))).toBeVisible();
      await expect(element(by.id('LoginScreen.errorMessage'))).toHaveText(
        'Password field must not be empty',
      );
    });

    it('should check if password less than 6 symbols', async () => {
      await element(by.id('LoginScreen.passwordInput')).typeText('small');
      await element(by.id('LoginScreen.loginButton')).tap();

      await expect(element(by.id('LoginScreen.errorMessage'))).toBeVisible();
      await expect(element(by.id('LoginScreen.errorMessage'))).toHaveText(
        'Password field must be more than 6 symbols',
      );
    });
  });

  describe('Error message being discarded after typing', () => {
    beforeEach(async () => {
      await element(by.id('LoginScreen.loginButton')).tap();
    });

    it('should discard when typing in email field', async () => {
      await element(by.id('LoginScreen.emailInput')).typeText('so');

      await expect(element(by.id('LoginScreen.errorMessage'))).toNotExist();
    });

    it('should discard password error message', async () => {
      await element(by.id('LoginScreen.passwordInput')).typeText('so');

      await expect(element(by.id('LoginScreen.errorMessage'))).toNotExist();
    });
  });

  describe('Authorization', () => {
    it('should fail to auth with invalid credentials', async () => {
      await element(by.id('LoginScreen.emailInput')).typeText('detox@wix.com');
      await element(by.id('LoginScreen.passwordInput')).typeText('123456');
      await element(by.id('LoginScreen.loginButton')).tap();

      await expect(element(by.id('LoginScreen.errorMessage'))).toBeVisible();
      await expect(element(by.id('LoginScreen.errorMessage'))).toHaveText(
        'Invalid credentials',
      );
    });

    it('should set root to dashboard screen when valid credentials', async () => {
      await element(by.id('LoginScreen.emailInput')).typeText('john@smith.co');
      await element(by.id('LoginScreen.passwordInput')).typeText(
        'AgentSmith85',
      );
      await element(by.id('LoginScreen.loginButton')).tap();

      await expect(element(by.id('DashboardScreen'))).toBeVisible();
    });
  });
});
