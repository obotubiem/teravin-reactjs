import { Container, Navbar } from "react-bootstrap"
import HomePage from "./pages/home"

function App() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">TERAVIN</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      <Container className="mt-5 p-5">
        <HomePage />
      </Container>
    </>
  )
}

export default App
