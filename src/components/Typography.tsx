import { FC } from 'react'

interface TypographyProps {
    children: string
    className?: string
}

export const Title: FC<TypographyProps> = ({ children, className }) => {
    return (
        <h1 className={`text-4xl font-black text-stone-950 ${className}`}>{children}</h1>
    )
}

export const SubTitle: FC<TypographyProps> = ({ children, className }) => {
    return (
        <p className={`text-xl text-stone-500 ${className}`}>{children}</p>
    )
}