import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Alert,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useSignIn } from "../../services/fetchers/auth/auth";

const Signin = () => {
  const { mutateAsync, error, mutate, isError, isLoading } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // let payloadData = { ...data, role_type: "super_admin" }; nte: handled in be
      const responseData = await mutateAsync(data);
      toast.success("Successfully registered!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.data) {
        const serverErrors = error.response.data.data;
        Object.keys(serverErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: serverErrors[field][0],
          });
        });
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="account-pages my-2 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <Card className="overflow-hidden">
              <CardBody className="pt-0">
                <h3 className="text-center mt-5 mb-4">Register</h3>
                <div className="p-1">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-solid"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Invalid email address",
                              },
                            })}
                            style={{
                              border: errors?.email ? "1px solid red" : "",
                            }}
                          />
                          {errors.email && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.email.message}
                            </p>
                          )}
                          {errors.email && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.email[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-solid"
                            {...register("password", {
                              required: "Password is required",
                            })}
                            style={{
                              border: errors?.password ? "1px solid red" : "",
                            }}
                          />
                          {errors.password && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.password.message}
                            </p>
                          )}
                          {errors.password && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.password[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            {...register("first_name", {
                              required: "First Name is required",
                            })}
                            style={{
                              border: errors?.first_name ? "1px solid red" : "",
                            }}
                          />
                          {errors.first_name && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.first_name.message}
                            </p>
                          )}
                          {errors.first_name && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.first_name[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            {...register("last_name", {
                              required: "Last Name is required",
                            })}
                            style={{
                              border: errors?.last_name ? "1px solid red" : "",
                            }}
                          />
                          {errors.last_name && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.last_name.message}
                            </p>
                          )}
                          {errors.last_name && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.last_name[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-solid"
                            {...register("dob", {
                              required: "Date of Birth is required",
                            })}
                            style={{
                              border: errors?.dob ? "1px solid red" : "",
                            }}
                          />
                          {errors.dob && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.dob.message}
                            </p>
                          )}
                          {errors.dob && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.dob[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Gender
                          </label>
                          <select
                            className="form-control form-control-solid"
                            {...register("gender", {
                              required: "Gender is required",
                            })}
                            style={{
                              border: errors?.gender ? "1px solid red" : "",
                            }}
                          >
                            <option value="">Select Gender</option>
                            <option value="m">Male</option>
                            <option value="f">Female</option>
                            <option value="o">Other</option>
                          </select>
                          {errors.gender && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.gender.message}
                            </p>
                          )}
                          {errors.gender && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.gender[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Phone
                          </label>
                          <input
                            type="tel"
                            className="form-control form-control-solid"
                            {...register("phone", {
                              required: "Phone number is required",
                            })}
                            style={{
                              border: errors?.phone ? "1px solid red" : "",
                            }}
                          />
                          {errors.phone && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.phone.message}
                            </p>
                          )}
                          {errors.phone && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.phone[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            {...register("address", {
                              required: "Address is required",
                            })}
                            style={{
                              border: errors?.address ? "1px solid red" : "",
                            }}
                          />
                          {errors.address && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.address.message}
                            </p>
                          )}
                          {errors.address && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.address[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-center mt-4">
                      <button
                        className="btn btn-primary btn-lg"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner size="sm" color="light" /> Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </button>
                    </div>
                    <div className="form-group mb-0 row">
                      <div className="col-12 mt-4">
                        <Link to="/login" className="">
                          Login?
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signin;
