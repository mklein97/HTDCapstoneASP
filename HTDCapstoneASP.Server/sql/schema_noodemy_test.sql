DROP DATABASE IF EXISTS noodemy_test;
CREATE database noodemy_test;
USE noodemy_test;

CREATE TABLE `app_role`(
    `role_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `role_name` VARCHAR(255) NOT NULL,
    `role_description` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `app_role` ADD UNIQUE `app_role_role_name_unique`(`role_name`);
CREATE TABLE `enrollment`(
    `enrollment_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `course_id` INT NOT NULL
);
CREATE TABLE `user_profile`(
    `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `dob` DATE NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `app_user_id` INT NOT NULL
);
ALTER TABLE
    `user_profile` ADD UNIQUE `user_profile_email_unique`(`email`);
CREATE TABLE `app_user`(
    `app_user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `disabled` TINYINT NOT NULL,
    `role_id` INT NOT NULL
);
CREATE TABLE `course`(
    `course_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `course_name` VARCHAR(255) NOT NULL,
    `course_description` VARCHAR(255) NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `estimate_duration` INT NOT NULL,
    `category_id` INT NOT NULL
);
CREATE TABLE `comment`(
    `comment_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `enrollment_id` INT NOT NULL,
    `created_at` DATE NOT NULL,
    `comment` VARCHAR(255) NOT NULL
);
CREATE TABLE `category`(
    `category_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(255) NOT NULL,
    `category_description` VARCHAR(255) NOT NULL,
    `category_code` VARCHAR(255) NOT NULL
);

ALTER TABLE
    `app_user` ADD CONSTRAINT `app_user_role_id_foreign` FOREIGN KEY(`role_id`) REFERENCES `app_role`(`role_id`);
ALTER TABLE
    `user_profile` ADD CONSTRAINT `user_profile_app_user_id_foreign` FOREIGN KEY(`app_user_id`) REFERENCES `app_user`(`app_user_id`);
ALTER TABLE
    `comment` ADD CONSTRAINT `comment_enrollment_id_foreign` FOREIGN KEY(`enrollment_id`) REFERENCES `enrollment`(`enrollment_id`) ON DELETE CASCADE;
ALTER TABLE
    `enrollment` ADD CONSTRAINT `enrollment_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user_profile`(`user_id`);
ALTER TABLE
    `course` ADD CONSTRAINT `course_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `category`(`category_id`);
ALTER TABLE
    `enrollment` ADD CONSTRAINT `enrollment_course_id_foreign` FOREIGN KEY(`course_id`) REFERENCES `course`(`course_id`);
    
delimiter //
create procedure set_known_good_state()
begin

    delete from `comment`;
    alter table `comment` auto_increment = 1;
    delete from enrollment;
    alter table enrollment auto_increment = 1;
    delete from course;
    alter table course auto_increment = 1;
    delete from category;
    alter table category auto_increment = 1;
    delete from user_profile;
    alter table user_profile auto_increment = 1;
    delete from app_user;
    alter table app_user auto_increment = 1;
    delete from app_role;
    alter table app_role auto_increment = 1;

    INSERT INTO app_role(role_name, role_description) VALUES
    ('ADMIN', 'Instructor'),
    ('USER', 'Student'),
    ('DUMMY', 'Role for testing'),
    ('DUMMY-UNUSED', 'Unused Role for testing');

    INSERT INTO app_user(username, password_hash, disabled, role_id) VALUES
    ('noodemyAdmin', 'admin', 0, 1), -- ADMIN
    ('testUser1', 'user1', 0, 2), -- USER
    ('testUser2', 'user2', 0, 2), -- USER
    ('dummyNoProfile', 'password', 0, 3), -- USER
    ('dummyUser', 'password', 1, 3); -- USER

    INSERT INTO user_profile(first_name, last_name, dob, email, app_user_id) VALUES
    ('Quang', 'Pham', '1996-01-15', 'admin@gmail.com', 1), -- ADMIN
    ('Quang', 'Du', '1980-09-09', 'student1@gmail.com', 2), -- STUDENT
    ('Matthew', 'Klein', '2000-03-05', 'student2@gmail.com', 3), -- STUDENT
    ('Dummy', 'Dummy', '2025-06-02', 'dummyEmail@gmail.com', 5); -- STUDENT

    INSERT INTO category(category_name, category_description, category_code) VALUES
    ('Computer Science', 'Covers programming and IT-related subjects', 'CS'),
    ('Literature', 'Focusing on literature, reading comprehension, and writing skills', 'LIT'),
    ('Business', 'Includes topics on management, finance, and entrepreneurship', 'BUS'),
    ('Psychology', 'Study of the mind and behavior', 'PSY'),
    ('Chemistry', 'Covers the study of substances, their properties, and reactions', 'CHEM'),
    ('Philosophy', 'Explores fundamental questions about existence, knowledge, and ethics', 'PHIL');
    
    
    INSERT INTO course(course_name, course_description, price, estimate_duration, category_id) VALUES 
    ('Web Development', 'Learn how to create a web application', 68, 80, 1), -- Computer Science
    ('English 1', 'Prepare for a college level reading and writing skill', 25, 46, 2), -- Literature
    ('English 2', 'Prepare for a college level reading and writing skill', 25, 30, 2); -- Literature
    
    INSERT INTO enrollment(user_id, course_id) VALUES
    (2, 2), -- Quang takes Literature
    (3, 1), -- Matt takes CS
    (2, 1); -- Quang takes CS
    
    INSERT INTO `comment` (enrollment_id, created_at, `comment`) VALUES
    (1, '2025-06-02', 'This class is so hard!'),
    (2, '2025-06-03', 'This class is a piece of cake');
    
end //
-- 4. Change the statement terminator back to the original.
delimiter ;