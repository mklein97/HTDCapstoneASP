import { Link, useParams } from "react-router";
import UserCard from "./UserCard";
import AdminCourseTable from "./AdminCourseTable";
import { JSX, useEffect, useState } from "react";
import { Course, CourseCardProps, Enrollment, UserProfile } from "../../Models";
import CourseCard from "../../CourseCard";
import FetchWrapper from "../../FetchWrapper";
import CourseCardList from "../Courses/CourseCardList";

const baseUrl = "https://localhost:7130";
const courseEndpoint = "/api/courses";

const USER_DEFAULT : UserProfile = {
    userId: 0,
    firstName: "",
    lastName: "",
    dob: new Date(),
    email: "",
    appUserId: 0,
    enrollmentList: []
}

function UserDetails() {
    const [user, setUser] = useState<UserProfile>(USER_DEFAULT);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const { userId } = useParams();
    const [courses, setCourses] = useState([]);

    // Fetch the user profile details
    useEffect(() => {

        FetchWrapper(`https://localhost:7130/api/users/${userId}`, {})
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject("Unexpected Status Code: " + response.status);
                }
            })
            .then((data) => {
                const userDetails: UserProfile = data;
                const enrollmentData: Enrollment[] = data.enrollmentList;
                setUser(userDetails);
                setEnrollments(enrollmentData);
            })

        FetchWrapper(`${baseUrl}${courseEndpoint}/users/${userId}`, {})
        .then(response => {
            if(response.status === 200)
                return response.json();
            else 
                return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }).then(data => setCourses(data)).catch(console.log);
    }, [courses])

    return (
        <>
            <section className="container mt-3">
                {user && <UserCard {...user} />}
                {localStorage.getItem("roleName") === "ADMIN" && <AdminCourseTable />}
            </section>

            <section>
               <CourseCardList user={user} courses={courses} />
            </section>
        </>
    )
}

export default UserDetails;