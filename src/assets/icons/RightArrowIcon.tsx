import { FC } from 'react'

interface RightArrowIconProps {
  className?: string
  stroke?: string
  width?: number
  strokeWidth?: number
}

const RightArrowIcon: FC<RightArrowIconProps> = ({ className, stroke, strokeWidth, width }) => {
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
      <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
}

export default RightArrowIcon