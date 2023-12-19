import { FC, ReactNode } from 'react'
import HomeIcon from '../assets/icons/HomeIcon'
import SettingsIcon from '../assets/icons/SettingsIcon'
import ActivityIcon from '../assets/icons/ActivityIcon'

interface NavItemProps {
    setPage: (page: string) => void
    name: string
    icon: ReactNode
    active: string
}

interface NavProps {
    page: string
    setPage: (page: string) => void
}

const NavItem: FC<NavItemProps> = ({ setPage, name, icon, active }) => {
    return (
        <li
            className={`w-full py-5 flex justify-center cursor-pointer border-t-2 ${active === name ? 'border-sky-600' : 'border-transparent'}`}
            onClick={() => {
                setPage(name)
            }}
        >
            {icon}
        </li>
    )
}

const Nav: FC<NavProps> = ({ page, setPage }) => {
    const active = page.split('-')[0]

    const items = [
        { name: 'home', icon: <HomeIcon stroke={active === 'home' ? '#0284c7' : undefined} /> },
        { name: 'activity', icon: <ActivityIcon stroke={active === 'activity' ? '#0284c7' : undefined} /> },
        { name: 'settings', icon: <SettingsIcon stroke={active === 'settings' ? '#0284c7' : undefined} /> }
    ]

    return (
        <nav className='absolute bottom-0 left-0 w-full border-t-[1px] border-stone-200 bg-white'>
            <ul className='flex items-center justify-between gap-5'>
                {items.map((item) => (
                    <NavItem
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                        active={active}
                        setPage={setPage}
                    />
                ))}
            </ul>
        </nav>
    )
}

export default Nav