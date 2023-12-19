import { FC } from 'react'
import Skeleton from './Skeleton'

interface EventCardSkeletonProps {
    className?: string
}

const EventCardSkeleton: FC<EventCardSkeletonProps> = ({ className }) => {
    return (
        <article className={`flex gap-2 ${className}`}>
            <Skeleton className='w-[20px] h-[20px]' />
            <div className='w-full'>
                <Skeleton className='w-1/3 h-[16px] mb-2' />
                <Skeleton className='w-full h-[16px]' />
            </div>
        </article>
    )
}

export default EventCardSkeleton