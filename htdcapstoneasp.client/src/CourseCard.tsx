import { JSX, useEffect, useState } from "react";
import {Course, Comment, UserProfile, CourseCardProps} from "./Models";
import {Tooltip, OverlayTrigger, Modal} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FetchWrapper from "./FetchWrapper";

const baseUrl = 'https://localhost:7130';
const courseEndpoint = baseUrl + '/api/courses';
const enrollmentEndpoint = baseUrl + '/api/enrollments';

const CourseCard: React.FC<CourseCardProps> = ({courseData, userProfile, enrolled, featured, update}) => {
    const [showComments, setShowComments] = useState(false);
    const [showJoinConfirm, setJoinConfirm] = useState(false);
    const [showDropConfirm, setDropConfirm] = useState(false);
    const [comments, setComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editCommentId, setEditCommentId] = useState(0);
    const [deleteCommentId, setDeleteCommentId] = useState(0);
    const [comment, setComment] = useState(new Comment(0,'',new Date().toUTCString(),0,''));
    const [refreshComments, setRefreshComments] = useState('');

    useEffect(() => {
        FetchWrapper(`${courseEndpoint}/${courseData.courseId}/comments`, {}).then(response => {
            if(response.status === 200)
                return response.json();
            else 
                return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }).then(data => setComments(data)).catch((error)=>console.log(error));
    }, [refreshComments]);


    const onCommentsClose = () => {
        setShowComments(false);
        setJoinConfirm(false);
        setDropConfirm(false);
        setIsEditing(false);
        setIsDeleting(false);
        setIsAdding(false);
    };
    const onCommentsShow = () => setShowComments(true);
    const onJoinConfirmShow = () => setJoinConfirm(true);
    const onDropConfirmShow = () => setDropConfirm(true);
    
    const data = courseData;
    const tt = (<Tooltip> {data.category.categoryName + '\n' + data.category.categoryDescription} </Tooltip>);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (isAdding) {
            console.log(userProfile)
            console.log('EID: ' + comment.enrollmentId)
            let request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: `{
                "enrollmentId": ${comment.enrollmentId},
                "createdAt": "${new Date().toLocaleDateString('en-CA')}",
                "comment": "${comment.comment}"
            }`
            };
            FetchWrapper('https://localhost:7130/api/Comments', request).then(response => {
                setRefreshComments('added');
                if(response.status === 201 || response.status === 400)
                    return response.json();
                else 
                    return Promise.reject(`Unexpected Status Code: ${response.status}`);
            }).catch(console.log);

        }

        if (isEditing) {
            let request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: `{
                "commentId": ${editCommentId},
                "enrollmentId": ${comment.enrollmentId},
                "createdAt": "${new Date().toLocaleDateString('en-CA')}",
                "comment": "${comment.comment}"
            }`
            };

            FetchWrapper('https://localhost:7130/api/comments/'+editCommentId, request).then(response => {
                setRefreshComments('edited')
                if(response.status === 204 || response.status === 400)
                    return response.json();
                else 
                    return Promise.reject(`Unexpected Status Code: ${response.status}`);
            }).catch(console.log);
        }
        //onCommentsClose();
        setIsEditing(false);
        setIsAdding(false);
    }

    const deleteComment = () => {
        let request = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };
        FetchWrapper('https://localhost:7130/api/comments/'+deleteCommentId, request).then(response => {
            setRefreshComments('deleted')
            if(response.status === 204 || response.status === 400)
                return response.json();
            else 
                return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }).catch(console.log);
        setIsDeleting(false);
    };

    const enrollUser = () => {
        let request = {
            method: "POST"
        };
        FetchWrapper('https://localhost:7130/api/enrollments/'+courseData.courseId+'/'+localStorage.getItem('userId'), request)
        .then(() => {onCommentsClose();if (update != undefined) update(courseData.courseName+'enrolled')}).catch(console.log);
    };

    const dropUser = () => {
        let request = {
            method: "DELETE"
        };

        let deleteId = 0;
        let profile: UserProfile = JSON.parse(JSON.stringify(userProfile));
        for (let e of profile.enrollmentList) {
            if (e.course.courseId === courseData.courseId) {
                deleteId = e.enrollmentId
                break;
            }
        }

        if (deleteId > 0) {
            FetchWrapper(`${enrollmentEndpoint}/${deleteId}`, request)
            .then(() => {onCommentsClose();if (update != undefined) update(courseData.courseName+'dropped')}).catch(console.log);
        }
    }
    
    let renderComments = (() => {
        let templist: JSX.Element[] = [];
        let parsedComments: Array<Comment> = [];
        comments.forEach(c => {
            parsedComments.push(JSON.parse(JSON.stringify(c)));
        });

        parsedComments.forEach(c => {
            let temp = <>
            <div key={c.commentId} className="border border-4 border-primary rounded mb-2">
                <div className="d-flex justify-content-between">
                    <div>{c.postedBy} says:</div>
                    <div className="align-right text-body-secondary">{new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="pt-2 pb-2">{c.comment}</div>
                {localStorage.getItem('username') === c.postedBy && <div>
                    <button className="btn btn-outline-warning btn-sm" onClick={() => {setIsEditing(true);setEditCommentId(c.commentId)}}>Edit 🖉</button>
                    <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => {setIsDeleting(true);setDeleteCommentId(c.commentId)}}>Delete 🗑</button>
                </div>}
            </div>
            </>;
            templist.push(temp);
        })
        return templist;
    })

    let renderCommentForm = ((s: string) => {
        return (<>
        <form onSubmit={onSubmit} className="mt-5">
            <fieldset className="form-group">
            {s.length > 0 && <textarea
                className="form-control"
                value={comment.comment}
                rows={5}
                onChange={(event) => {
                    const newComment = {...comment};
                    newComment.comment = event.currentTarget.value;
                    for (let e of userProfile.enrollmentList) {
                        if (e.course.courseId === courseData.courseId) {
                            newComment.enrollmentId = e.enrollmentId;
                            break;
                        }
        }
        setComment(newComment);}}
            />}
            {s.length === 0 && <textarea
                className="form-control"
                rows={5}
                onChange={(event) => {
                    const newComment = {...comment};
                    newComment.comment = event.currentTarget.value;                    
                    for (let e of userProfile.enrollmentList) {
                        if (e.course.courseId === courseData.courseId) {
                            newComment.enrollmentId = e.enrollmentId;
                            break;
                        }
                    }
                    setComment(newComment);}}
            />}
            </fieldset>
            <button
                type="submit"
                className="btn btn-outline-success"
                >
                Submit
            </button>
        </form>
        </>)
    });

    let renderCommentDeleteConfirmation = (() => {
        return (<>
        <h4>Delete Comment?</h4>
        <button className="btn btn-danger" onClick={deleteComment}>Delete</button>
        </>)
    });

    let commJSON = comments.find((c: Comment) => c.commentId === editCommentId);
    let comm: Comment = new Comment(0, '', '', 0, '');
    if (commJSON !== undefined)
        comm = JSON.parse(JSON.stringify(commJSON));

    return (
        <>
        {/* Comments Modal */}
        <Modal show={showComments} onHide={onCommentsClose}>
            <Modal.Header closeButton>
            <Modal.Title>{isEditing? 'Edit Comment' : courseData.courseName + ' Comments'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!isEditing && !isDeleting && !isAdding && renderComments()}
                {isEditing && renderCommentForm(comm.comment)}
                {isAdding && renderCommentForm('')}
                {isDeleting && renderCommentDeleteConfirmation()}
            </Modal.Body>
            <Modal.Footer>
            <button className="btn btn-secondary" onClick={onCommentsClose}>
                Close
            </button>
            {enrolled && !isEditing && !isDeleting && (
            <button className="btn btn-success" onClick={() => setIsAdding(true)}>
                Add New Comment
            </button>
            )}
            </Modal.Footer>
        </Modal>

        {/* Confirm Join Course Modal */}
        <Modal show={showJoinConfirm} onHide={onCommentsClose}>
            <Modal.Header closeButton>
            <Modal.Title>{courseData.courseName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Join this course?
            </Modal.Body>
            <Modal.Footer>
            <button className="btn btn-success" onClick={enrollUser}>
                Join
            </button>
            <button className="btn btn-secondary" onClick={onCommentsClose}>
                Close
            </button>
            </Modal.Footer>
        </Modal>

        {/* Confirm Drop Course Modal */}
        <Modal show={showDropConfirm} onHide={onCommentsClose}>
            <Modal.Header closeButton>
            <Modal.Title>{courseData.courseName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Drop this course?
            </Modal.Body>
            <Modal.Footer>
            <button className="btn btn-danger" onClick={dropUser}>
                Drop
            </button>
            <button className="btn btn-secondary" onClick={onCommentsClose}>
                Close
            </button>
            </Modal.Footer>
        </Modal>

        {/* Main Card */}
        <div className="d-flex p-2 flex-row border border-secondary rounded m-3 bg-primary overflow-auto">
            <div className="d-flex p-1 flex-column flex-grow-1">
                <h4 className="fw-bold text-decoration-underline text-wrap" style={{ wordWrap: 'break-word' }}>{data.courseName}</h4>
                <OverlayTrigger placement="bottom" overlay={tt}>
                    <h5>{data.category.categoryCode}</h5>
                </OverlayTrigger>
                <h5>Estimated Duration: {data.estimateDuration+' hours'}</h5>
                <h5>Price: {'$'+data.price}</h5>

                {!featured && localStorage.getItem("roleName") !== "ADMIN" && (
                    <h5 className={enrolled? "text-success" : "text-warning"}>
                        {enrolled? "Status: Enrolled ✓" : "Status: Not Enrolled ❌"}
                    </h5>
                )}                
    
                <div className="flex-row">

                {!featured && (
                    <>
                        {localStorage.getItem("roleName") !== "ADMIN" && 
                        (enrolled ? 
                            (
                                <button className="btn btn-danger" onClick={onDropConfirmShow}>Drop Course 🗑</button>
                            ) : (
                                <button className="btn btn-success" onClick={onJoinConfirmShow}>Join Course 🗹</button>
                            )
                        )}

                        <button className="btn btn-secondary align-right ms-3" onClick={onCommentsShow}>Comments 🗩</button>
                    </>
                )}
                </div>
            </div>
            <div     className="border border-black rounded p-1 fs-5 bg-dark flex-shrink-0 mh-100 mw-100 overflow-auto"
            style={{height: 208, width: '70%'}}>
                <div className="fs-4 fw-semibold text-decoration-underline">Course Description</div>
                {data.courseDescription}
            </div>
        </div>
        </>
    )
}

export default CourseCard;