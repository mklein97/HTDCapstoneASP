import React, { useState } from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { Route, Routes } from "react-router-dom"
import Navbar from './Navbar'
import Home from './Home'
import Login from './Login'
import SignUp from './SignUp'
import Courses from './Courses'
import CourseForm from './CourseForm'
import Logout from './Logout'
import UserDetails from './components/UserDetails/UserDetails'
import Protected from "./Protected"
import UserList from './UserList'

function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem("username"));

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<h1>You're not authorized to visit this page.</h1>} />
        <Route path="*" element={<><h1>Oops!</h1><p>The page you were looking for does not exist :(</p></>} />
        {/* Required Login */}
        <Route element={<Protected />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/add" element={<CourseForm requiredRole="ADMIN"/>} />
          <Route path="/courses/edit/:courseId" element={<CourseForm requiredRole="ADMIN"/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/user-details/:userId" element={<UserDetails />}/>
          <Route path="/users/:userId" element={<SignUp />} />
          <Route path="/users" element={<UserList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
