
type Props = {
    color?:string,
    size?:number,
    stroke?:number
}

function ArrowRight({color,size,stroke}: Props) {
  return (
    <>
    <svg width={size ||"24" } height={ size ||"24" } viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={ color ||"black"} strokeWidth={stroke||"3"} stroke-linecap="round" strokeLinejoin="round"/>
    </svg>
    </>
  )
}

export default ArrowRight