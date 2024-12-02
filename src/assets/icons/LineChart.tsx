type Props = {
  size?:number
  color?:string
}

function LineChart({size,color}: Props) {
  return (
    <>
    <svg width={size||"12"} height={size||"12"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21H21M19 9L14 14L10 10L7 13" stroke={color||'black'}   strokeWidth="2" stroke-linecap="round" strokeLinejoin="round"/>
    </svg>
    </>
  )
}

export default LineChart