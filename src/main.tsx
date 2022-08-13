import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Button } from '@mui/material';

import '@/assets/global.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/pages/sidebar'
import Sidebar from '@/pages/sidebar';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Sidebar />} >
          <Route path="world" element={<h2>NETSTED</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
