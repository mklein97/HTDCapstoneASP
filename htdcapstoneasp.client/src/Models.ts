export class Category {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
    categoryCode: string;

    constructor(id: number, name: string, description: string, code: string) {
        this.categoryId = id;
        this.categoryName = name;
        this.categoryDescription = description;
        this.categoryCode = code;
    }
}

export class Role {
    id: number;
    name: string;
    description: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export class Course {
    public courseId: number = 0;
    public courseName: string;
    public courseDescription: string;

    price: number;
    estimateDuration: number;
    category: Category;

    constructor(name: string, desc: string, price: number, duration: number, category: Category, courseId?: number) {
        if (courseId !== undefined)
            this.courseId = courseId;
        this.courseName = name;
        this.courseDescription = desc;
        this.price = price;
        this.estimateDuration = duration;
        this.category = category;
    }
}

export class Enrollment {
    userId: number;
    course: Course;
    enrollmentId: Number;
    constructor(userId: number, course: Course, enrollmentId: Number) {
        this.userId = userId;
        this.course = course;
        this.enrollmentId = enrollmentId;
    }
}

export class EnrollmentUserProfile {
    userId: number;
    course: Course;
    enrollmentId: number;

    constructor(userId: number, course: Course, enrollmentId: number) {
        this.userId = userId;
        this.course = course;
        this.enrollmentId = enrollmentId;
    }
}

export class UserProfile {
    userId: number;
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    appUserId: number;
    enrollmentList: Array<EnrollmentUserProfile>;

    constructor(userId: number, firstName: string, lastName: string, dob: Date, email: string, appUserId: number, enrollmentList: Array<EnrollmentUserProfile>) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.email = email;
        this.appUserId = appUserId;
        this.enrollmentList = enrollmentList;
    }
}

export class UserProfileAppUser {
    userId: number;
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    appUserId: number;
    username: string;
    disabled: boolean;

    constructor(userId: number, firstName: string, lastName: string, dob: Date, email: string, appUserId: number,
        username: string, disabled: boolean) 
    {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.email = email;
        this.appUserId = appUserId;
        this.username = username;
        this.disabled = disabled;
    }
    
}

export class Comment {
    commentId: number;
    comment: string;
    createdAt: string;
    enrollmentId: number;
    postedBy: string;

    constructor(commentId: number, comment: string, created: string, enrollmentId: number, postedBy: string) {
        this.commentId = commentId;
        this.comment = comment;
        this.createdAt = created;
        this.enrollmentId = enrollmentId;
        this.postedBy = postedBy;
    }
}

export class CourseCardProps {
    courseData: Course;
    userProfile: UserProfile;
    enrolled: boolean;
    featured?: boolean;
    update?: (updateValue: string) => void;

    constructor(cdata: Course, userProfile: UserProfile, enrolled: boolean) {
        this.courseData = cdata;
        this.userProfile = userProfile;
        this.enrolled = enrolled;
    }
}

export class RegisterRequestDTO {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    roleId: number;

    constructor(username: string, password: string, firstName: string, lastName: string, email: string, dob: string, roleId: number) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.roleId = roleId;
    }
}

export class RegisterResponseDTO {
    userId: number;
    username: string;

    constructor(userId: number, username: string) {
        this.username = username;
        this.userId = userId;
    }
}


export class LoginRequestDTO {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

export class LoginResponseDTO {
    username: string;
    roleName: string;
    jwtToken: string;
    userId: number;

    constructor(
        username: string,
        roleName: string,
        jwtToken: string,
        userId: number) {
        this.username = username;
        this.roleName = roleName;
        this.jwtToken = jwtToken;
        this.userId = userId;
    }
}