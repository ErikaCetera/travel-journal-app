import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMapMarkedAlt, FaPlusCircle, FaUser, FaHome } from 'react-icons/fa';

const Navbar = () => {
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
                        <li className="nav-item me-4">
                            <a className="nav-link d-flex align-items-center" href="/">
                                <FaHome className="me-2" />
                                Home
                            </a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link d-flex align-items-center" href="#">
                                <FaMapMarkedAlt className="me-2" />
                                Esplora i viaggi
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="#">
                                <FaPlusCircle className="me-2" />
                                Aggiungi una nuova meta
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center" href="#">
                                <FaUser className="me-2" />
                                Login
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;



