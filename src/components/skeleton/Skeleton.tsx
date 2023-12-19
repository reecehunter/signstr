import { FC } from 'react'

interface SkeletonProps {
    className?: string
}

const Skeleton: FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={`bg-stone-300 rounded-sm animate-pulse ${className}`}></div>
    )
}

export default Skeleton