type Props = {color:string}

function FileSearchIcon({color}: Props) {
  return (
    <div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M4.268 21C4.44311 21.3033 4.69479 21.5553 4.99786 21.7308C5.30094 21.9063 5.64478 21.9991 5.995 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V7M9 18L7.5 16.5M8 14C8 15.6569 6.65685 17 5 17C3.34315 17 2 15.6569 2 14C2 12.3431 3.34315 11 5 11C6.65685 11 8 12.3431 8 14Z" stroke={color} strokeWidth="2" stroke-linecap="round" strokeLinejoin="round"/>
</svg>

    </div>
  )
}

export default FileSearchIcon