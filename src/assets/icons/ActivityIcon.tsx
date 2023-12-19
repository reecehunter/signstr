import { FC } from 'react'

interface ActivityIconProps {
  className?: string
  stroke?: string
  width?: number
  strokeWidth?: number
}

const ActivityIcon: FC<ActivityIconProps> = ({ className, stroke, strokeWidth, width }) => {
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  )
}

export default ActivityIcon