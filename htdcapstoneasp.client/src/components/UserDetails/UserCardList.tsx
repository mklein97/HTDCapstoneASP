
import { JSX, useState } from "react";
import { Course, CourseCardProps, UserProfile } from "../../Models";
import UserCard from "./UserCard";

interface Props {
    users: Array<UserProfile>;
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

const UserCardList: React.FC<Props> = ({ users }) => {

    let cards: JSX.Element[] = [];
    let cardData: Array<UserProfile> = [];

    users.forEach((user) => {
        cardData.push(JSON.parse(JSON.stringify(user)) as UserProfile);
    });

    cardData.forEach(user => {
        cards.push(<UserCard key={user.userId} {...user}></UserCard>);
    });

    return (
        <>
            <section>
                {cards}
            </section>
        </>
    )
}

export default UserCardList;