type Props = { color: string ,height?:number,width?:number};


function Dock({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"24"}
    height={height?height:"24"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.33398 5.33366H14.6673M4.00065 10.667H12.0007M2.66732 2.66699H13.334C14.0704 2.66699 14.6673 3.26395 14.6673 4.00033V12.0003C14.6673 12.7367 14.0704 13.3337 13.334 13.3337H2.66732C1.93094 13.3337 1.33398 12.7367 1.33398 12.0003V4.00033C1.33398 3.26395 1.93094 2.66699 2.66732 2.66699Z" stroke={color} strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
    </svg>
    </div>
  )
}

export default Dock