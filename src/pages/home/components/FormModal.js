import { FieldArray, Formik } from "formik"
import { useEffect, useMemo, useState } from "react"
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import * as Yup from "yup"
import config from "../../../config"
import axios from "axios"
import moment from "moment"
import _ from "lodash"

const FormModal = (props) => {
  const defaultValues = useMemo(
    () => ({
      name: "",
      email: "",
      mobile: "",
      birthDate: null,
      addresses: [{ address: "" }],
    }),
    []
  )
  const [initialValues, setInitialValues] = useState(defaultValues)

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    mobile: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone number is required"),
    birthDate: Yup.date().required("Birth date is required").nullable(),
    addresses: Yup.array()
      .of(Yup.object().shape({ address: Yup.string().required("Required") }))
      .min(1, "min 1 address"),
  })

  let title = "Add Employee"
  if (props.type === "edit") title = "Edit Employee"

  useEffect(() => {
    const newValues = { ...defaultValues, ...props.initialValues }
    if (newValues.birthDate) newValues.birthDate = new Date(newValues.birthDate)
    if (!newValues.addresses || !newValues.addresses.length > 0)
      newValues.addresses = defaultValues.addresses

    setInitialValues(newValues)
  }, [props.initialValues, defaultValues])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = _.pick(values, [
        "name",
        "email",
        "mobile",
        "birthDate",
        "addresses",
      ])
      if (payload.birthDate)
        payload.birthDate = moment(payload.birthDate).format("YYYY-MM-DD")

      if (payload.addresses) {
        payload.addresses = payload.addresses.map((item) =>
          _.pick(item, ["id", "address"])
        )
      }
      if (props.type === "add") {
        await axios.post(config.apiUrl + `/employee`, payload)
      } else {
        await axios.put(config.apiUrl + `/employee/` + props.editId, payload)
      }

      props.onSuccess(props.type)
    } catch (error) {
      console.log(error)
    }
    setSubmitting(false)
  }

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
          isSubmitting,
          handleSubmit,
        }) => (
          <>
            <Modal.Body>
              <Form>
                {values.id && (
                  <Row className="mb-3">
                    <Form.Label className="col-sm-4">ID</Form.Label>
                    <Col md={8}>
                      <Form.Control type="text" disabled value={values.id} />
                    </Col>
                  </Row>
                )}
                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Name</Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      isInvalid={touched.name && errors.name}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.name && errors.name && (
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Email address</Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      isInvalid={touched.email && errors.email}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.email && errors.email && (
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Mobile</Form.Label>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      name="mobile"
                      pattern="^-?[0-9]\d*\.?\d*$"
                      placeholder="Enter Mobile Number"
                      isInvalid={touched.mobile && errors.mobile}
                      value={values.mobile}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const regex = /^[0-9\b]+$/
                        if (
                          e.target.value === "" ||
                          regex.test(e.target.value)
                        ) {
                          handleChange(e)
                        }
                      }}
                    />
                    {touched.mobile && errors.mobile && (
                      <Form.Control.Feedback type="invalid">
                        {errors.mobile}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Birthdate</Form.Label>
                  <Col md={8}>
                    <DatePicker
                      className={`form-control ${
                        touched.birthDate && errors.birthDate
                          ? "is-invalid"
                          : ""
                      }`}
                      dateFormat="yyyy-MM-dd"
                      selected={values.birthDate}
                      onChange={(date) => setFieldValue("birthDate", date)}
                    />
                    {touched.birthDate && errors.birthDate && (
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: "unset" }}
                      >
                        {errors.birthDate}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label className="col-sm-4">Address</Form.Label>
                  <Col md={8}>
                    <FieldArray name="addresses">
                      {({ insert, remove, push }) => (
                        <>
                          {values.addresses.length > 0 &&
                            values.addresses.map((address, index) => (
                              <>
                                <InputGroup className="mb-2">
                                  <Form.Control
                                    name={`addresses.${index}.address`}
                                    value={values.addresses[index].address}
                                    placeholder={`Address ${index + 1}`}
                                    isInvalid={
                                      touched.addresses &&
                                      touched.addresses[index]?.address &&
                                      errors.addresses &&
                                      errors.addresses[index]?.address
                                    }
                                    onChange={handleChange}
                                  />
                                  {index + 1 < values.addresses.length ? (
                                    <Button
                                      variant="outline-secondary"
                                      onClick={() => remove(index)}
                                    >
                                      x
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline-secondary"
                                      onClick={() => push({ address: "" })}
                                    >
                                      +
                                    </Button>
                                  )}
                                </InputGroup>
                                {touched.addresses &&
                                  touched.addresses[index]?.address &&
                                  errors.addresses &&
                                  errors.addresses[index]?.address && (
                                    <Form.Control.Feedback
                                      type="invalid"
                                      style={{ display: "unset" }}
                                    >
                                      {errors.addresses[index].address}
                                    </Form.Control.Feedback>
                                  )}
                              </>
                            ))}
                        </>
                      )}
                    </FieldArray>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.onHide}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  )
}

FormModal.defaultProps = {
  onHide: () => {},
  show: false,
  type: "add",
  initialValues: null,
  editId: null,
  onSuccess: () => {},
}

export default FormModal
