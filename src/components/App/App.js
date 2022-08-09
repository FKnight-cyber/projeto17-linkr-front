import { BrowserRouter,Routes,Route } from "react-router-dom"
import GlobalStyle from "../../theme/globalStyle.js";
import UserContext from "../../contexts/UserContext.js"
import { useState } from "react"
import Login from "../../pages/Login.jsx";
import Register from "../../pages/Register/Register.jsx";
import Timeline from "../../pages/Timeline.js";
import 'react-toastify/dist/ReactToastify.css';
import './_app.css'

export default function App(){
    const [token,setToken] = useState(localStorage.getItem('authToken'));

    const userContext = {
        token,
        setToken
    }

    return(
        <BrowserRouter>
            <GlobalStyle />
            <UserContext.Provider value={userContext}>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/signup' element={<Register />} />
                    <Route path='/timeline' element={<Timeline />} />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    )
}