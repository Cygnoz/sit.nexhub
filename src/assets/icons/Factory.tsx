type Props = { color: string ,height?:number,width?:number};

function Factory({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"24"}
    height={height?height:"24"}viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_8351_54168)">
    <path d="M11.334 11.9997H12.0007M8.00065 11.9997H8.66732M4.66732 11.9997H5.33398M1.33398 13.333C1.33398 13.6866 1.47446 14.0258 1.72451 14.2758C1.97456 14.5259 2.3137 14.6663 2.66732 14.6663H13.334C13.6876 14.6663 14.0267 14.5259 14.2768 14.2758C14.5268 14.0258 14.6673 13.6866 14.6673 13.333V5.33301L10.0007 8.66634V5.33301L5.33398 8.66634V2.66634C5.33398 2.31272 5.19351 1.97358 4.94346 1.72353C4.69341 1.47348 4.35427 1.33301 4.00065 1.33301H2.66732C2.3137 1.33301 1.97456 1.47348 1.72451 1.72353C1.47446 1.97358 1.33398 2.31272 1.33398 2.66634V13.333Z" stroke={color} strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_8351_54168">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    </div>
  )
}

export default Factory