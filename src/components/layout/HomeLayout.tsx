import { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import Nav from '../Nav'
import CurrentAccountInfo from '../CurrentAccountInfo'

interface HomeLayoutProps {
    children: ReactNode
    page: string
    setPage: Dispatch<SetStateAction<string | undefined>>
}

const HomeLayout: FC<HomeLayoutProps> = ({ children, page, setPage }) => {
    return (
        <div className='flex flex-col h-full'>
            <CurrentAccountInfo page={page} setPage={setPage} />
            {children}
            <Nav page={page} setPage={setPage} />
        </div>
    )
}

export default HomeLayout