import PostCard from "@/components/PostCard"
import { time } from "console"

export default () => {
    return <div className="max-w-3xl m-auto grid grid-cols-1 py-5 gap-5">
        {
            [1, 2, 3, 4, 5, 6].map((i) => {
                return <PostCard
                    post={
                        {
                            user: {
                                id: 1234,
                                nickname: "스카티",
                                image_url: "http://"
                            },
                            createdAt: new Date(),
                            content: "어떤 내용이 일단 많이 존재한다",
                            likes: 10,

                            latitude: 10.000,
                            longitude: 10.000,
                        }
                    }
                    key={i}></PostCard>
            })
        }
    </div>
}