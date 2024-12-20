export const isAuthenticated = () => {
  const token = localStorage.getItem("userInfo");
  if (!token) return false;

  try {
    // Check if token exists and is not expired
    const userInfo = JSON.parse(token);
    return !!userInfo;
  } catch (error) {
    return false;
  }
};
