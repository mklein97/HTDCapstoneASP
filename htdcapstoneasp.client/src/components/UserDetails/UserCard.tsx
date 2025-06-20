import { useEffect, useState } from "react";
import { UserProfile } from "../../Models";
import "./UserCard.css"
import { Link } from "react-router-dom";


const UserCard: React.FC<UserProfile> = ({ firstName, lastName, dob, email, userId }) => {
    return (
        <>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="user-card shadow bg-primary bg-opacity-25 p-4 text-center rounded-3">
                            <h3 className="fw-bold text-primary">{firstName + " " + lastName}</h3>
                            <p className="text-primary">{localStorage.getItem("username")}</p>
                            <p><strong>Email: </strong><span>{email}</span></p>
                            <p><strong>Date of Birth: </strong><span>{dob ? new Date(dob).toLocaleDateString() : ""}</span></p>
                            <p><strong>Role: </strong><span>{localStorage.getItem("roleName")?.substring(5)}</span></p>
                            <div>
                                <Link className="btn btn-primary" to={`/users/${userId}`}>Update User</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard;