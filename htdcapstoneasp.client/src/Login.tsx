import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoginRequestDTO, LoginResponseDTO } from "./Models";
import FetchWrapper from "./FetchWrapper";
import logo from "./LogoPlaceholder.png"

const baseUrl = "https://localhost:7130";
const loginEndpoint = baseUrl + "/api/auth";
const REQUEST_DEFAULT : LoginRequestDTO = {
    username: "",
    password: ""
}

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

function Login ({ setUser } : LoginProps) {

    const [textInputClass, setTextInputClass] = useState("form-control")
    const [loginRequestDTO, setLoginRequestDTO] = useState(REQUEST_DEFAULT);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // setTextInputClass('form-control is-invalid')

        sendLoginRequest();    
    }

    const onValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;
        setLoginRequestDTO(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const sendLoginRequest = () => {
        postLoginRequest(loginRequestDTO)
            .then((data) => {
                if (data.jwtToken) {
                    const loginResponseDTO : LoginResponseDTO = data; 
                    localStorage.setItem("jwtToken", loginResponseDTO.jwtToken);
                    localStorage.setItem("username", loginResponseDTO.username);
                    localStorage.setItem("userId", loginResponseDTO.userId.toString());
                    localStorage.setItem("roleName", loginResponseDTO.roleName);
                    setUser(loginResponseDTO.username);
                    navigate("/");
                } else {
                    console.log(data);
                    setErrors(data);
                }
            })
            .catch(console.log);
    }

    return (<>
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <img className="d-block mx-auto w-50" src={logo}></img>
                    <div className="card shadow-sm">
                        <div className="card-body">

                            <form onSubmit={onSubmit}>
                                <fieldset className="form-group">
                                    {/* Errors */}
                                    <div>
                                        <ul>
                                            {errors.map((e: String) =>
                                                <li key={e.length + (Math.random() * 100)} style={{ color: "lightcoral" }}>{e}</li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Username */}
                                    <label htmlFor="username" className="form-label mt-3">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        className={textInputClass}
                                        id="username"
                                        name="username"
                                        placeholder="Enter Username"
                                        onChange={onValueChanged}
                                        required
                                    />

                                    {/* Password */}
                                    <label htmlFor="password" className="form-label mt-3">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={textInputClass}
                                        id="password"
                                        name="password"
                                        placeholder="Enter Password"
                                        onChange={onValueChanged}
                                        required
                                    />
                                </fieldset>

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-3 mr-3"
                                    >
                                    Login
                                </button>

                                <Link to={'/'} className={'btn btn-secondary mt-3 ms-3'}>Close</Link>
                                <p className="mt-3">Don't have an account?</p>
                                <Link to='/signup'> Create one here!</Link>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}


function postLoginRequest(loginRequest : LoginRequestDTO) {
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginRequest)
    }

    return FetchWrapper(loginEndpoint + '/login', request)
        .then(response => {
            if (response.status === 200 || response.status === 400) {
                return response.json();
            } else {
                return Promise.reject(`Unexpected status code: ${response.status}`);
            }
        });

}

export default Login;