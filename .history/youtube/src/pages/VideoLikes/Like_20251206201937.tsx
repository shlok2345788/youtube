import LikeVideos from '@/components/LikeVideos'
import { Suspense } from 'react'


const Like = () => {
    return (
        <main className="flex-1 p-6">
            <div className="max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Liked videos</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <LikeVideos />
                </Suspense>
            </div>
        </main>
    )
}

export default Like
