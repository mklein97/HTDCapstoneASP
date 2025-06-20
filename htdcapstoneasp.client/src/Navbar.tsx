import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

function Navbar({ user, setUser }: NavbarProps) {

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        // navigate("/");
    };

    const navigate = useNavigate();

    return (
        <>
            <header className="bg-primary border-bottom">
                <nav className="navbar navbar-expand-sm  bg-primary" data-bs-theme="dark">
                    <div className="container-fluid">
                        <Link to={'/'} className="navbar-brand">Noodemy</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto">
                                <Link to="/" className="nav-item nav-link">Home</Link>

                                {user != null && (
                                    <Link to="/courses" className="nav-item nav-link">Courses</Link>
                                )}
                                {localStorage.getItem("roleName") === "ADMIN" && (
                                    <>
                                        <Link to="/users" className="nav-item nav-link">User List</Link>
                                        <Link to="/courses/add" className="nav-item nav-link">Add Course</Link>
                                    </>
                                )}

                            </ul>
                        </div>
                        {user == null ? (
                            <div>
                                <Link to='/login' className='btn btn-outline-light me-2'>Login</Link>
                                <Link to='/signup' className='btn btn-outline-light'>Sign Up</Link>
                            </div>
                        ) : (
                            <div>
                                <span
                                    className="badge rounded-pill bg-light text-dark"
                                    onClick={() => navigate(`/user-details/${localStorage.getItem("userId")}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {localStorage.getItem("username")}
                                </span>
                                <Link to='/logout' onClick={handleLogout} className='btn btn-outline-light ms-3'>Logout</Link>

                            </div>
                        )}


                    </div>
                </nav>

            </header>
        </>
    );
}

export default Navbar;