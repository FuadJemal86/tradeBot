import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import SignUp from './pages/TraderSignUp/SignUp';
import NotFound from './pages/NotFound';
import PostProduct from './pages/PostProduct/PostProduct';
import RightSideBar from './pages/RightSideBar';
import Products from './pages/AdminSide/product/Products';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/auth" element={<RightSideBar />} >
          <Route path="" element={<Products />} />
          <Route path="post-product" element={<PostProduct />} />
        </Route>

      </Routes>
    </>
  )
}

export default App