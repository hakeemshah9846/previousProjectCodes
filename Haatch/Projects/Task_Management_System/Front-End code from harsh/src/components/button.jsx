const Button = (props) => {

    return (
        <div className={' border-0 rounded d-flex  align-items-center justify-content-center ' + props.className}
            onClick={props.onClick}
        >
            <button type={props.type} disabled={props.disabled} className={"border-0 rounded d-flex  align-items-center justify-content-center  "+ props.className}>
                <span>{props.text}</span>
                {props.icon && <img src={props.icon} alt="icon" />}
            </button>

        </div>

    )
}

export default Button;