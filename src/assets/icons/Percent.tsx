type Props = { color: string ,height?:number,width?:number};


function Percent({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"24"}
    height={height?height:"24"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.666 3.33366L3.33268 12.667M5.99935 4.33366C5.99935 5.25413 5.25316 6.00033 4.33268 6.00033C3.41221 6.00033 2.66602 5.25413 2.66602 4.33366C2.66602 3.41318 3.41221 2.66699 4.33268 2.66699C5.25316 2.66699 5.99935 3.41318 5.99935 4.33366ZM13.3327 11.667C13.3327 12.5875 12.5865 13.3337 11.666 13.3337C10.7455 13.3337 9.99935 12.5875 9.99935 11.667C9.99935 10.7465 10.7455 10.0003 11.666 10.0003C12.5865 10.0003 13.3327 10.7465 13.3327 11.667Z" stroke={color}strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"/>
    </svg>
    </div>
  )
}

export default Percent