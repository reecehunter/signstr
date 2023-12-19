import { FC } from 'react'

interface HomeIconProps {
  className?: string
  stroke?: string
  width?: number
  strokeWidth?: number
}

const HomeIcon: FC<HomeIconProps> = ({ className, stroke, strokeWidth, width }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width || '24'}
      height={width || '24'}
      viewBox='0 0 24 24'
      fill='none'
      stroke={stroke || 'currentColor'}
      strokeWidth={strokeWidth || '2'}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
      <polyline points='9 22 9 12 15 12 15 22'></polyline>
    </svg>
  )
}

export default HomeIcon