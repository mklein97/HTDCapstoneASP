import { useEffect, useState } from "react";
import FetchWrapper from "./FetchWrapper";
import { UserProfile, UserProfileAppUser } from "./Models";

const baseUrl = "https://localhost:7130";
const userEndpoint = baseUrl + "/api/users";
const appUserEndpoint = baseUrl + "/api/app-users"

const USER_PROFILE_APP_USER_DEFAULT : UserProfileAppUser = {
    userId: 0,
    firstName: "",
    lastName: "",
    dob: new Date(),
    email: "",
    appUserId: 0,
    username: "",
    disabled: false
}

function UserList() {
    const [users, setUsers] = useState<UserProfileAppUser[]>([]);

    useEffect(() => {
        FetchWrapper(`${userEndpoint}/full`, {})
            .then(response => {
                if(response.status === 200)
                    return response.json();
                else 
                    return Promise.reject(`Unexpected Status Code: ${response.status}`);
            })
            .then(data => setUsers(data)).catch(console.log);
    }, []);

    const handleDisableUser = (userId : Number) => {
        let disablingUser = users.find(user => user.userId === userId ) ?? USER_PROFILE_APP_USER_DEFAULT;

        if (window.confirm(`Disabling user ${disablingUser.firstName} ${disablingUser.lastName}, #ID ${disablingUser.userId}. Do you want to proceed?`)) {
            let request = {
                method: "DELETE"
            };

            FetchWrapper(appUserEndpoint + `/${disablingUser.appUserId}`, request)
                .then(response => {
                    if (response.status === 204) {  
                        const newuserList = users.map(user => {
                            if (user.userId === disablingUser.userId) {
                                return {...user, disabled: true};
                            }

                            return user;
                        });
                        setUsers(newuserList);
                    } else {
                        return Promise.reject(`Unexpected status code: ${response.status}`);
                    }
                })
                .catch(console.log);
        }
    }

    
    const handleEnableUser = (userId : Number) => {
        let enablingUser = users.find(user => user.userId === userId ) ?? USER_PROFILE_APP_USER_DEFAULT;

        if (window.confirm(`Enabling user ${enablingUser.firstName} ${enablingUser.lastName}, #ID ${enablingUser.userId}. Do you want to proceed?`)) {
            let request = {
                method: "PUT"
            };

            FetchWrapper(appUserEndpoint + `/${enablingUser.appUserId}`, request)
                .then(response => {
                    if (response.status === 204) {
                        const newuserList = users.map(user => {
                            if (user.userId === enablingUser.userId) {
                                return {...user, disabled: false};
                            }

                            return user;
                        });
                        setUsers(newuserList);
                    } else {
                        return Promise.reject(`Unexpected status code: ${response.status}`);
                    }
                })
                .catch(console.log);
        }
    }


    return (
        <>
            <section>
                <h1>User List</h1>
            </section>
            <section>
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>User Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>DOB</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.dob.toString()}</td>
                                <td>
                                    {user.disabled ? (
                                        <button className="btn btn-success" onClick={() => handleEnableUser(user.userId)}>Enable</button>
                                    ) : (
                                        <button className="btn btn-danger" onClick={() => handleDisableUser(user.userId)}>Disable</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default UserList;