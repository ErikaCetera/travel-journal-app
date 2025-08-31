import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaPlusCircle, FaUser, FaHome } from 'react-icons/fa';

const Navbar = () => {

  const closeMobileMenu = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
      <div className="container-fluid">

        {/* Bottone mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Link di navigazione */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item ">
              <Link to="/" className="nav-link d-flex align-items-center" onClick={closeMobileMenu}>
                <FaHome className="me-2" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link d-flex align-items-center" onClick={closeMobileMenu}>
                <FaMapMarkedAlt className="me-2" />
                Esplora i viaggi
              </Link>
            </li>
            <li className="nav-item ">
              <Link to="/create" className="nav-link d-flex align-items-center" onClick={closeMobileMenu}>
                <FaPlusCircle className="me-2" />
                Aggiungi una nuova meta
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/login" className="nav-link d-flex align-items-center">
                <FaUser className="me-2" />
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



