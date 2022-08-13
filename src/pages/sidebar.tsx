import { AppBar, Button, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BluetoothIcon from '@mui/icons-material/Bluetooth';

export default () => {
    let [showSidebar, setSidebar] = useState<boolean>(false)
    return (
        <div className='flex h-screen'>
            <aside className={`${showSidebar ? "w-64" : "w-10"} py-2 overflow-y-auto transition-all`} >
                <div className='bg-gray-200 rounded dark:bg-gray-800 shadow-md h-full'>
                    <IconButton>
                        <BluetoothIcon />

                    </IconButton>
                </div>
            </aside>
            <div className='w-screen transition'>
                <header className='mx-2 px-2 h-12 flex overflow-x-auto bg-gray-50 rounded shadow-md'>
                    <div className='flex'>
                        <Button variant='text' onClick={() => { setSidebar(!showSidebar) }}>abc</Button>
                        <Button variant='text' onClick={() => { setSidebar(!showSidebar) }}>abc</Button>
                        <Button variant='text' onClick={() => { setSidebar(!showSidebar) }}>abc</Button>
                        <Button variant='text' onClick={() => { setSidebar(!showSidebar) }}>abc</Button>
                    </div>
                </header>
                <Outlet />
            </div>
        </div >
    )
}
