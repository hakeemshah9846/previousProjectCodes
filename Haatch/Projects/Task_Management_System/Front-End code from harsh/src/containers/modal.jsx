import { Modal } from "react-bootstrap";
import SmallBtn from "../components/btns";
import Button from "../components/button";
import Button2 from "../components/button-2";
const ModalComponent = (props) => {
    const { onHide, show, Header, btnText1, btnText2, Content, setShow, onClick, btns } = props;
    return (
        <Modal show={show} centered onHide={onHide}>
            <Modal.Title className="d-flex justify-content-center">
                {Header}
            </Modal.Title>
            <Modal.Body className="d-flex justify-content-center">
                {Content}
            </Modal.Body>
            <Modal.Body>
                {btns&& btns.map(e => {
                    return (
                        <SmallBtn text={e}/>
                    )
                })}
            </Modal.Body>
            <Modal.Body className="d-flex justify-content-center gap-3">
                <Button
                    onClick={onClick}
                    className="bg-primary-blue text-white" text={btnText1} />
                <Button2 onClick={
                    () => {
                        setShow(false)
                    }
                } text={btnText2} className="border-primary-blue color-primary-blue" />
            </Modal.Body>

        </Modal>
    )
}

export default ModalComponent 