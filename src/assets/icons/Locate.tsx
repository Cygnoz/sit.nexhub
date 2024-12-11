
type Props = { color: string ,height?:number,width?:number};

function Locate({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"24"}
    height={height?height:"24"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_8351_54021)">
    <path d="M1.33398 7.99967H3.33398M3.33398 7.99967C3.33398 10.577 5.42332 12.6663 8.00065 12.6663M3.33398 7.99967C3.33398 5.42235 5.42332 3.33301 8.00065 3.33301M12.6673 7.99967H14.6673M12.6673 7.99967C12.6673 10.577 10.578 12.6663 8.00065 12.6663M12.6673 7.99967C12.6673 5.42235 10.578 3.33301 8.00065 3.33301M8.00065 1.33301V3.33301M8.00065 12.6663V14.6663" stroke={color} strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_8351_54021">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    </div>
  )
}

export default Locate