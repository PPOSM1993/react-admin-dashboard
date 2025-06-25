export const getCurrentUser = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  return JSON.parse(auth);
};

export const loginAs = (user) => {
  localStorage.setItem("auth", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("auth");
};
