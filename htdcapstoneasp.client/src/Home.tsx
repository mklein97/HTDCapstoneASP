import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./LogoPlaceholder.png"
import { Course } from "./Models";
import FetchWrapper from "./FetchWrapper";
import CourseCardList from "./components/Courses/CourseCardList";

const baseUrl = "https://localhost:7130";
const courseEndpoint = baseUrl + "/api/courses";
const commentEndpoint = baseUrl + "/api/comments";
const numOfFeaturedCourses = 3;

function Home(){
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        FetchWrapper(courseEndpoint, {})
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(`Unexpected status code: ${response.status}`);
            })
            .then(data => setFeaturedCourses(data))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const setFeaturedCourses = (courses : Course[]) => {
        // select n random distinct numbers in range [0, courses.length-1] => featuredCourses
        // setCourses(featuredCourses)

        const numSet = new Set<Number>();
        while (numSet.size < courses.length && numSet.size < numOfFeaturedCourses) {
            numSet.add(getRandomInteger(courses.length));
        }

        const featuredCourses : Course[] = [];
        
        numSet.forEach(function(index) {
            featuredCourses.push(courses[index.valueOf()]);
        });
        //console.log(featuredCourses)
        setCourses(featuredCourses);
    }

    return(
        <>
        <header className="container col-md-8">
            <img className="d-block mx-auto w-50" src={logo}></img>
        </header>
        <div className="container">
            <h1 className="text-center">Welcome to Noodemy!</h1>
            <section className="about">
                <p className="text-center">
                    For the past 30 years, we've been a leading source of knowledge for learners worldwide. 
                    <br />
                    Explore our featured courses — hand-picked for their exceptional quality and top ratings among the hundreds we offer!
                </p>
            </section>
            <section className="mt-4">
                <h2 className="text-center">Featured Courses</h2>
                <div className="home-course-card-list">
                    <CourseCardList courses={courses} featured={true}/>
                </div>
            </section>
        </div>
        </>
    )
}

function getRandomInteger(max: number) : number {
    return Math.floor(Math.random() * max);
};

export default Home;