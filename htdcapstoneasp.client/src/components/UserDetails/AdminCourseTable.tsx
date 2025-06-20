import { useEffect, useState } from "react";
import FetchWrapper from "../../FetchWrapper";

import { Course } from "../../Models";
import { Link } from "react-router-dom";

const AdminCourseTable: React.FC = () => {

    const [courseData, setCourseData] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course>();

    useEffect(() => {
        let request = {
            method: "GET"
        };
        FetchWrapper("https://localhost:7130/api/courses", request)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject("Unexpected Status Code: " + response.status);
                }
            })
            .then(data => setCourseData(data))
            .catch(console.log)
    }, [])

    const handleDelete = (id: number | undefined) => {
        if (id === undefined) return;
        let request = {
            method: "DELETE"
        };
        FetchWrapper(`https://localhost:7130/api/courses/${id}`, request)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject("Unexpected Status Code: " + response.status);
                }
            })
            .then(() => {
                setCourseData(courseData.filter(c => c.courseId != id));
            })
            .catch(console.log)
    }

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Course ID</th>
                        <th scope="col">Course Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Duration</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {courseData && courseData.length > 0 ? (
                        courseData.map((course) => (
                            <tr key={course.courseId}>
                                <th scope="row">{course.courseId}</th>
                                <td>{course.courseName}</td>
                                <td>{course.category.categoryName}</td>
                                <td>{course.price}</td>
                                <td>{course.estimateDuration}</td>
                                <td>
                                    <Link to={`/courses/edit/${course.courseId}`}>Edit</Link>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setSelectedCourse(course)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#myModal"
                                    >Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>No courses found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* <!-- The Modal --> */}
            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Delete Course</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete {selectedCourse?.courseName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" 
                            data-bs-dismiss="modal" onClick={() => handleDelete(selectedCourse?.courseId)}
                            >Delete</button>
                            <button type="button" className="btn btn-info" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminCourseTable;