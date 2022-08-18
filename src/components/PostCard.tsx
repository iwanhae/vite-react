import { Avatar, Button, Card, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React from "react"
import { stringSince } from "@/libs/time";

type Props = {
    post: {
        user: {
            id: number,
            nickname: string,
            image_url: string,
        };
        content: string
        likes: number

        longitude: number
        latitude: number

        createdAt: Date
    }
};

const App: React.FC<Props> = (p) => {
    return <Card variant="outlined" className="gap-3 grid grid-cols-1 p-3">
        <div className="grid grid-cols-2">
            <div className="flex gap-3">
                <Avatar className="my-auto">{p.post.user.nickname[0]}</Avatar>
                <p className="my-auto">{p.post.user.nickname ?? "Loading..."}</p>

            </div>
            <div className="flex flex-row-reverse text-gray-400 text-right">
                <div className="my-auto text-xs">{stringSince(p.post.createdAt)}</div>
            </div>
        </div>

        <div>
            {p.post.content}
        </div>
        <div className="flex flex-row-reverse gap-1">
            <p>{p.post.likes}</p>
            <FavoriteBorderIcon />
        </div>

    </Card >
}

export default App