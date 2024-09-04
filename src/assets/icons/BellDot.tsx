
type Props = {
    color?:string
}

function BellDot({color}: Props) {
  return (
    <>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3C3 17 6 15 6 8C6 4.7 8.7 2 12 2C12.7 2 13.3 2.1 13.9 2.3M10.3 21C10.4674 21.3044 10.7135 21.5583 11.0125 21.7352C11.3116 21.912 11.6526 22.0053 12 22.0053C12.3475 22.0053 12.6885 21.912 12.9876 21.7352C13.2866 21.5583 13.5327 21.3044 13.7 21M21 8C21 9.65685 19.6569 11 18 11C16.3431 11 15 9.65685 15 8C15 6.34315 16.3431 5 18 5C19.6569 5 21 6.34315 21 8Z" stroke={color ||"#F6F6F6"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </>
  )
}

export default BellDot