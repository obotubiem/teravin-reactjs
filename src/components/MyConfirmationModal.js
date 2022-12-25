import { Modal, Button } from "react-bootstrap"

const MyConfirmationModal = (props) => {
  const {
    show,
    onClose,
    onConfirm,
    onCancel,
    title,
    message,
    textCancel,
    textOk,
    okVariant,
    cancelVariant,
  } = props

  return (
    <Modal show={show} onHide={onClose}>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant={cancelVariant} onClick={onCancel}>
          {textCancel}
        </Button>
        <Button variant={okVariant} onClick={onConfirm}>
          {textOk}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

MyConfirmationModal.defaultProps = {
  show: false,
  title: null,
  message: "Message",
  cancelVariant: "secondary",
  okVariant: "primary",
  textCancel: "Cancel",
  textOk: "OK",
  onClose: () => {},
  onConfirm: () => {},
  onCancel: () => {},
}

export default MyConfirmationModal
