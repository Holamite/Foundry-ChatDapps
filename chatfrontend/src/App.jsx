import { configureWeb3Modal } from "./connection";
import Header from "./component/Header"
import './App.css'
import '@radix-ui/themes/styles.css';



configureWeb3Modal();
function App() {


  return (
    <>
      <Header/>
    </>
  )
}

export default App
