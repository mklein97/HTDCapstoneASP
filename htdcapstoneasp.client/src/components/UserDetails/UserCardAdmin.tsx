import { useEffect, useState } from "react";
import { UserProfile } from "../../Models";

const UserCardAdmin: React.FC<UserProfile> = ({firstName, lastName, dob, email}) => {
    return (
        <>
            <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title">{firstName + " " + lastName} </h5>
                    <p className="card-text"><strong>Email: </strong><span>{email}</span></p>
                    <p className="card-text"><strong>Date of Birth: </strong><span>{dob ? new Date(dob).toLocaleDateString() : ""}</span></p>
                </div>
            </div>
        </>
    )
}

export default UserCardAdmin;