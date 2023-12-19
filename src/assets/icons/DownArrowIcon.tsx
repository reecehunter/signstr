import { FC } from 'react'

interface DownArrowIconProps {
  className?: string
  stroke?: string
  width?: number
  strokeWidth?: number
}

const DownArrowIcon: FC<DownArrowIconProps> = ({ className, stroke, strokeWidth, width }) => {
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
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}

export default DownArrowIcon