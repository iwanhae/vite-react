import React from 'react'
import { Outlet } from 'react-router-dom'

export default () => {
    return (
        <>
            <h1>HelloWorld</h1>
            <Outlet />
        </>
    )
}
