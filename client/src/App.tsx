import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import SignUp from './pages/TraderSignUp/SignUp';
import NotFound from './pages/NotFound';
import Products from './pages/Products/Products';
import PostProduct from './pages/PostProduct/PostProduct';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/products" element={<Products />} />
        <Route path="/post-product" element={<PostProduct />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App