export default function Logout() {
  const logout = () => {
    localStorage.clear();
    window.location = "/login";
  };

  logout();
}
