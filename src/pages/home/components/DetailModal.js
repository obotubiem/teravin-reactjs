import { useEffect, useState } from "react"
import { Button, Form, Modal, Row } from "react-bootstrap"
import "react-datepicker/dist/react-datepicker.css"

import config from "../../../config"
import axios from "axios"
import moment from "moment"

const DetailModal = (props) => {
  const [data, setData] = useState(null)

  let title = "Detail Employee"
  if (props.deleteId) title = "Delete Employee"

  moment.locale("id")

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  const handleDelete = async () => {
    try {
      await axios.delete(config.apiUrl + `/employee/` + props.deleteId)

      props.onDelete()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data && (
          <Form>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">ID</label>
              <div class="col-sm-9">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  value={data.id}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Name</label>
              <div class="col-sm-9">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  value={data.name}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Email</label>
              <div class="col-sm-9">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  value={data.email}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Mobile</label>
              <div class="col-sm-9">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  value={data.mobile}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">BirthDate</label>
              <div class="col-sm-9">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  value={moment(data.birthDate).format("DD MMMM YYYY")}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Address</label>
              <div class="col-sm-9">
                {data.addresses.map((item) => (
                  <input
                    type="text"
                    readonly
                    class="form-control-plaintext"
                    value={item.address}
                  />
                ))}
              </div>
            </div>
          </Form>
        )}
        {props.deleteId && (
          <>
            <hr />
            <p className="fs-6 fst-italic">
              Are you sure want to delete this employee ?
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {props.deleteId ? (
          <>
            <Button variant="secondary" onClick={props.onHide}>
              Cancel
            </Button>
            <Button variant="danger" type="button" onClick={handleDelete}>
              Delete
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

DetailModal.defaultProps = {
  onHide: () => {},
  show: false,
  data: null,
  deleteId: null,
  onDelete: () => {},
}

export default DetailModal
