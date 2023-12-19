import { FC } from 'react'

interface ButtonProps {
    variant?: 'contained' | 'outlined'
    className?: string
    onClick: () => void
    children: string
    disabled?: boolean
}

const Button: FC<ButtonProps> = ({ variant='contained', className='', onClick, children, disabled=false }) => {
    const contained = `${disabled ? 'bg-stone-300' : 'bg-sky-600 hover:bg-sky-700'} text-white`
    const outlined = `bg-transparent hover:bg-sky-200 hover:bg-opacity-50 text-sky-600 border-[1px] border-sky-600`

    return (
        <button
            style={{ fontSize: '1rem' }}
            className={`py-2 px-4 transition-colors rounded-sm ${variant === 'contained' ? contained : outlined} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button