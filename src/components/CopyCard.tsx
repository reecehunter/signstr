import { FC } from 'react'
import truncateKey from '../utils/truncate-key'
import CopyIcon from '../assets/icons/CopyIcon'

interface CopyCardProps {
    copyText: string
    children: string
    className?: string
}

const CopyCard: FC<CopyCardProps> = ({ copyText, children, className }) => {
    const copy = () => {
        navigator.clipboard.writeText(copyText)
    }

    return (
        <article
            className={`p-2 cursor-pointer flex items-center justify-between bg-sky-200 rounded-sm ${className}`}
            onClick={copy}
        >
            <p className='text-sky-500'>{truncateKey(children)}</p>
            <CopyIcon width={18} stroke='#0284c7' />
        </article>
    )
}

export default CopyCard