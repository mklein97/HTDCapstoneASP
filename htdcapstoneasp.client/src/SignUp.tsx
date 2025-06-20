import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { RegisterRequestDTO, RegisterResponseDTO, UserProfile } from "./Models";
import FetchWrapper from "./FetchWrapper";

const baseUrl = "https://localhost:7130";
const registerEndpoint = baseUrl + "/api/auth/register";
const userEndpoint = baseUrl + "/api/users";

const REQUEST_DEFAULT : RegisterRequestDTO = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    roleId: 2
}

const USER_DEFAULT : UserProfile = {
    userId: 0,
    firstName: "",
    lastName: "",
    dob: new Date(),
    email: "",
    appUserId: 0,
    enrollmentList: []
}

function SignUp() {
    const [textInputClass, setTextInputClass] = useState("form-control")
    const [registerRequestDTO, setRegisterRequestDTO] = useState(REQUEST_DEFAULT);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const { userId } = useParams();

    const linkToOnSuccess = userId ? `/user-details/${localStorage.getItem("userId")}` : '/login';
    const linkToOnCancel = userId ? `/user-details/${localStorage.getItem("userId")}` : '/';

    useEffect(() => {
        
        // When Editing
        if (userId) {
            FetchWrapper(`${userEndpoint}/${userId}`, {})
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject("Unexpected Status Code: " + response.status);
                }
            })
            .then(data => {
                if (data.userId) {
                    setRegisterRequestDTO(data);
                }
            })
            .catch(console.log)
        }

    }, [])

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // setTextInputClass('form-control is-invalid');

        if (userId) {
            updateUser();
        } else {
            addUser();
        }
    }

    const onValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;
        setRegisterRequestDTO(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    }

    const addUser = () => {
        let request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerRequestDTO)
        }

        FetchWrapper(registerEndpoint, request)
            .then(response => {
                console.log(response.body)
                if (response.status === 201 || response.status === 400) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then(data => {
                if (data.userId) {
                    // TODO: maybe redirect to a confirmation page
                    navigate(linkToOnSuccess);
                } else {
                    setErrors(data);
                    window.scrollTo(0, 0);
                }
            })
            .catch(console.log);
    }

    const updateUser = () => {
        const init = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerRequestDTO)
        }

        FetchWrapper(`${userEndpoint}/${userId}`, init)
            .then(response => {
                if (response.status === 204) {
                    return registerRequestDTO;
                } else if (response.status === 400) {
                    return response.json();
                } else {
                    return Promise.reject(`Unexpected status code: ${response.status}`);
                }
            })
            .then((data) => {
                if (data.userId) {
                    navigate(linkToOnSuccess);
                } else {
                    setErrors(data);
                    window.scrollTo(0, 0);
                }
            })
            .catch(console.log)
    }

    return (<>
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">{userId ? "Edit Account" : "Create New Account"}</h2>
                            <form onSubmit={onSubmit}>

                                {/* Errors */}
                                <div className="mb-3">
                                    <ul>
                                        {errors.map((e: String) =>
                                            <li key={e.length + (Math.random() * 100)} style={{ color: "lightcoral" }}>{e}</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label mt-4">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className={textInputClass}
                                        id="email"
                                        name="email"
                                        value={registerRequestDTO.email}
                                        placeholder="Enter email"
                                        onChange={onValueChanged}
                                    />
                                </div>

                                {!userId && (
                                    <>
                                        {/* Username */}
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label mt-4">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                className={textInputClass}
                                                id="username"
                                                name="username"
                                                placeholder="Enter Username"
                                                onChange={onValueChanged}
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label mt-4">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                className={textInputClass}
                                                id="password"
                                                name="password"
                                                placeholder="Enter Password"
                                                onChange={onValueChanged}
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        {/* <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label mt-4">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className={textInputClass}
                                                id="confirmPassword"
                                                placeholder="Enter Password"
                                                onChange={onValueChanged}
                                            />
                                        </div> */}
                                    </>
                                )}

                                {/* First Name */}
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label mt-4">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        className={textInputClass}
                                        id="firstName"
                                        name="firstName"
                                        value={registerRequestDTO.firstName}
                                        placeholder="Enter First Name"
                                        onChange={onValueChanged}
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label mt-4">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        className={textInputClass}
                                        id="lastName"
                                        name="lastName"
                                        value={registerRequestDTO.lastName}
                                        placeholder="Enter Last Name"
                                        onChange={onValueChanged}
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="mb-3">
                                    <label htmlFor="dob" className="form-label mt-4">
                                    Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        className={textInputClass}
                                        id="dob"
                                        name="dob"
                                        value={registerRequestDTO.dob}
                                        placeholder="Enter Date of Birth"
                                        onChange={onValueChanged}
                                    />     
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-4 mr-3"
                                    >
                                    {userId ? "Edit Account" : "Create Account"}
                                </button>

                                <Link to={linkToOnCancel} className={'btn btn-secondary mt-4 ms-3'}>Cancel</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}


export default SignUp;