import { JSX } from "react/jsx-runtime";
import CourseCard from "./CourseCard";
import {Course, UserProfile, CourseCardProps, Comment} from "./Models";
import { useEffect, useState } from "react";
import FetchWrapper from "./FetchWrapper";
import CourseCardList from "./components/Courses/CourseCardList";

const USER_DEFAULT : UserProfile = {
    userId: 0,
    firstName: "",
    lastName: "",
    dob: new Date(),
    email: "",
    appUserId: 0,
    enrollmentList: []
}

function Courses() {
    const URL = 'https://localhost:7130/api/courses'
    const [courses, setCourses] = useState([]);
    const [userProfile, setUserProfile] = useState(USER_DEFAULT);
    const [update, setUpdate] = useState('');

    useEffect(() => {
        let request = {
            method: "GET"
        };

        FetchWrapper(URL, request)
        .then(response => {
            if(response.status === 200)
                return response.json();
            else 
                return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }).then(data => setCourses(data)).catch(console.log);
        
        FetchWrapper('https://localhost:7130/api/users/'+localStorage.getItem('userId'), request).then(response => {
            if(response.status === 200)
                return response.json();
            else 
                return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }).then(data => setUserProfile(data)).catch(console.log);
    }, [update])
    
    let handleCallback = (u: string) => {
        // Update the name in the component's state
        setUpdate(u);
    };

    let cards: JSX.Element[] = [];
    let cardData: Array<Course> = [];
    
    courses.forEach((c) => {
        cardData.push(JSON.parse(JSON.stringify(c)) as Course);
    });

    cardData.forEach(c => {
        let enrolled = false;
        if (userProfile !== null) {
            let profile: UserProfile = JSON.parse(JSON.stringify(userProfile));
            for (let e of profile.enrollmentList) {
                if (e.course.courseId === c.courseId) {
                    enrolled = true;
                    break;
                }
            }
        
        let temp = new CourseCardProps(c, userProfile, enrolled);
        temp.update = handleCallback;
        cards.push(<CourseCard key={c.courseId} {...temp}></CourseCard>);
        }
    });

    return (
        <>
            <h1 className="ps-3">All Courses</h1>
            {cards}
        </>
    )
}

export default Courses;