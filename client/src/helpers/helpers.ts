
export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const authenticate = (response: { data: { access_token: string } }, next: () => void) => {
  console.log('authenticate: %s', response.data.access_token);
  setLocalStorage("access_token", response.data.access_token);
  next();
};

export const signout = () => {
  console.log('signout');
  removeLocalStorage("access_token");
};

export const isAuthenticated = () => {
  console.log('isAuthenticated: %s', localStorage.getItem("access_token") || 'false');
  if (localStorage.getItem("access_token")) {
    return JSON.parse(localStorage.getItem("access_token") as string);
  }
};
