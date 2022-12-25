import axios from "axios"
import React, { useRef, useState } from "react"
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap"
import config from "../../config"
import DataTable from "./components/DataTable"
import DetailModal from "./components/DetailModal"
import FormModal from "./components/FormModal"

const Index = () => {
  const defaultFormModal = {
    show: false,
    initialValues: null,
    type: "add",
    editId: null,
  }

  const defaultDetailModal = {
    show: false,
    data: null,
    deleteId: null,
  }

  const [formModal, setFormModal] = useState(defaultFormModal)
  const [search, setSearch] = useState("")
  const tableRef = useRef(null)

  const [detailModal, setDetailModal] = useState(defaultDetailModal)

  const handleSearch = () => {
    tableRef.current.doFilter({ q: search })
  }

  const handleCloseForm = () => {
    setFormModal({
      ...formModal,
      show: false,
    })
  }

  const handleCloseDetail = () => {
    setDetailModal({
      ...defaultFormModal,
      show: false,
    })
  }

  const handleAdd = () => {
    setFormModal({
      ...defaultFormModal,
      show: true,
      initialValues: null,
    })
  }

  const handleDetail = async (data) => {
    try {
      const id = data.id
      const { data: resData } = await axios.get(
        config.apiUrl + `/employee/` + id
      )

      setDetailModal({
        ...defaultDetailModal,
        show: true,
        data: resData.data,
      })
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  const handleEdit = async (data) => {
    try {
      const id = data.id
      const { data: resData } = await axios.get(
        config.apiUrl + `/employee/` + id
      )

      setFormModal({
        ...defaultFormModal,
        show: true,
        initialValues: resData.data,
        type: "edit",
        editId: id,
      })
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  const handleDelete = async (data) => {
    try {
      const id = data.id
      const { data: resData } = await axios.get(
        config.apiUrl + `/employee/` + id
      )

      setDetailModal({
        ...defaultDetailModal,
        show: true,
        data: resData.data,
        deleteId: resData.data.id,
      })
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  const onSubmitSuccess = (type) => {
    handleCloseForm()
    if (["edit", "delete"].includes(type)) {
      tableRef.current.reloadData()
    } else {
      tableRef.current.refreshData()
    }
  }

  const onDeleteSuccess = () => {
    handleCloseDetail()
    tableRef.current.reloadData()
  }

  return (
    <>
      <Card>
        <Card.Header as="h5">List Employee</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <div className="float-end">
                <Form
                  className="d-inline-block"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSearch()
                  }}
                >
                  <div>
                    <InputGroup style={{ width: "400px" }}>
                      <Form.Control
                        placeholder="Search by ID, name or email"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Button type="submit" variant="outline-secondary">
                        Search
                      </Button>
                    </InputGroup>
                  </div>
                </Form>
                <div className="d-sm-inline-block ms-5">
                  <Button variant="primary" onClick={() => handleAdd()}>
                    Add
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <DataTable
                ref={tableRef}
                onDetail={(data) => handleDetail(data)}
                onEdit={(data) => handleEdit(data)}
                onDelete={(data) => handleDelete(data)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <FormModal
        {...formModal}
        onHide={handleCloseForm}
        onSuccess={onSubmitSuccess}
      />

      <DetailModal
        {...detailModal}
        onHide={handleCloseDetail}
        onDelete={onDeleteSuccess}
      />
    </>
  )
}

export default Index
