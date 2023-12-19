import { FC } from 'react'

interface CopyIconProps {
  className?: string
  stroke?: string
  width?: number
  strokeWidth?: number
}

const CopyIcon: FC<CopyIconProps> = ({ className, stroke, strokeWidth, width }) => {
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  )
}

export default CopyIcon