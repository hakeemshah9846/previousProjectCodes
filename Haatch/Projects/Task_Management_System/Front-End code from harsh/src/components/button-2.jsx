import filterIcon from '../assets/icons/filter.svg';
const Button2=({src,text,className,onClick})=>{
    return (
    <button onClick={onClick} className={'rounded bg-white '+className}>
        {src && <img  src={src} alt="" />}
        <span>{text}</span>
    </button>)
}

export default Button2;