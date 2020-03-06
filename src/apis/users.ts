const url = 'https://kickstart.lukatu.com/';

function login(email: string, password: string) {
  return fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then(res => res.json())
    .then(data => data.session);
}

function getUsername(session: string): Promise<string> {
  return fetch(url + 'me', {
    method: 'GET',
    headers: {
      Authentication: session,
    },
  })
    .then(res => res.json())
    .then(data => data.username);
}

export default {login, getUsername};
