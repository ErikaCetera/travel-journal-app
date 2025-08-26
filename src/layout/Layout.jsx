import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <header className="logo-header mt-3">
        <div className="logo-wrapper">
          <img src="/logo2.png" alt="Logo" className="logo-img" />
          <h1 className="logo-title">IL MIO DIARIO DI VIAGGIO</h1>
        </div>
      </header>

      <div className="page-background">
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
