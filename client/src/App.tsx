import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import SignUp from './pages/TraderSignUp/SignUp';
import NotFound from './pages/NotFound';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App