import { configureWeb3Modal } from "./connection";
import Header from "./component/Header"
import './App.css';
import { ToastContainer } from 'react-toastify';
import '@radix-ui/themes/styles.css';
import Resigtration from "./component/Resigtration";
import "./output.css";
import { Container } from "@radix-ui/themes";
import Message from "./component/Message"


configureWeb3Modal();
function App() {
  return (
    <>
      <Container className="px-[2rem]">
      <Resigtration/>
      <ToastContainer />
      </Container>
    </>
  )
}

export default App
