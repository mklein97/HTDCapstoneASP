import { JSX, useState } from "react";
import { Course, CourseCardProps, UserProfile } from "../../Models";
import CourseCard from "../../CourseCard";

interface Props {
    user?: UserProfile;
    courses: Array<Course>;
    featured?: boolean;
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

const CourseCardList: React.FC<Props> = ({ user, courses, featured }) => {

    let cards: JSX.Element[] = [];
    let cardData: Array<Course> = [];

    courses.forEach((c) => {
        cardData.push(JSON.parse(JSON.stringify(c)) as Course);
    });

    cardData.forEach(c => {
        let enrolled = false;
        if (user !== null && user !== undefined) {
            let profile: UserProfile = JSON.parse(JSON.stringify(user));
            for (let e of profile.enrollmentList) {
                if (e.course.courseId === c.courseId) {
                    enrolled = true;
                    break;
                }
            }
        }
        
        let temp = new CourseCardProps(c, user ?? USER_DEFAULT, enrolled);
        cards.push(<CourseCard key={c.courseId} {...temp} featured={featured}></CourseCard>);
    });

    return (
        <>
            <section>
                {cards}
            </section>
        </>
    )
}

export default CourseCardList;