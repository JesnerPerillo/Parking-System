import { Link } from "react-router-dom"
export default function Home(){
  return(
    <>
      <h1>Hello World</h1>
      <Link to="/landingpage">Landing Page</Link>
      <Link to="/studentsignin">Student Signin</Link>
    </>
  )
}