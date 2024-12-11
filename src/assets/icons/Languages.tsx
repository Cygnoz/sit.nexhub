type Props = { color: string ,height?:number,width?:number};


function Languages({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"24"}
    height={height?height:"24"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_8351_52808)">
    <path d="M3.33398 5.33301L7.33398 9.33301M2.66732 9.33301L6.66732 5.33301L8.00065 3.33301M1.33398 3.33301H9.33398M4.66732 1.33301H5.33398M14.6673 14.6663L11.334 7.99967L8.00065 14.6663M9.33398 11.9997H13.334" stroke={color}strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_8351_52808">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    </div>
  )
}

export default Languages