import { Edit } from '@mui/icons-material';
import { Badge, Fab, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default () => {
    const data = ["서울특별시 강남구", "남산타워", "카카오 판교아지트", "뭔가 새로운 기나긴 장소"]
    return <>
        <header className='mx-auto px-2 h-12 flex overflow-x-auto bg-gray-50 rounded shadow-md max-w-screen-lg'>
            <div className='flex'>
                <div className='m-auto px-3'>
                    <Typography >힠!</Typography>
                </div>
                <div className='flex w-max overflow-x-scroll'>
                    {data.map(item => {
                        return <div className='m-auto px-1'>
                            <Badge className='bg-gray-300 rounded-full py-1 px-2'>{item}</Badge>
                        </div>
                    })}
                </div>
            </div>
        </header>
        <Outlet />
        <div
            className='fixed z-90 bottom-10 right-8 drop-shadow-lg flex justify-center items-center'>
            <Fab color="primary" >
                <Edit />
            </Fab>
        </div>

    </>
}
