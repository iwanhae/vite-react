import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import '@/assets/index.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><h1>Hello World</h1><Outlet /></>} >
          <Route path="world" element={<h2>NETSTED</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
