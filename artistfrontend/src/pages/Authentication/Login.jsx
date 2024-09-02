import React from "react";

// Redux
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";

// import images

import { useLogin } from "../../services/fetchers/auth/auth";

const Login = (props) => {
  // handleValidSubmit
  const {
    mutateAsync,
    error,
    mutate,
    isError,
    isLoading: isLoadingLogin,
  } = useLogin();
  const navigate = useNavigate();

  const {
    register: register,
    formState: { errors },
    handleSubmit: handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const responseData = await mutateAsync(values);
      console.log(responseData);
      if (responseData?.data?.token) {
        localStorage.setItem("token", responseData?.data?.token);
        const domain = window.location.origin;
        const newUrl = domain + "/dashboard";
        window.location.replace(newUrl);
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Invalid credentials");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Error during login:", error);
    }
  };

  return (
    <React.Fragment>
      <title>Login</title>
      <div className="account-pages my-2 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <CardBody className="pt-0">
                  <h3 className="text-center mt-5 mb-4">Artist Management</h3>

                  <div className="p-1">
                    <h4 className=" font-size-18 mb-1 text-center ">
                      Welcome Back !
                    </h4>
                    <p className=" text-center">Log in to continue .</p>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      id="custom-modal-form"
                    >
                      <div className="mb-3">
                        <label className="col-form-label fw-bold fs-6">
                          Email
                        </label>
                        <input
                          type=""
                          style={{
                            border: errors?.email ? "1px solid red" : "",
                          }}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "Invalid email address",
                            },
                          })}
                          name="email"
                          className="form-control form-control-solid"
                        />
                        {errors.email && (
                          <p style={{ color: "red", marginTop: "5px" }}>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className=" col-form-label  fw-bold fs-6">
                          Password
                        </label>
                        <input
                          type="password"
                          style={{
                            border: errors?.password ? "1px solid red" : "",
                          }}
                          {...register("password", {
                            required: " Password is rquried",
                          })}
                          name="password"
                          className="form-control form-control form-control-solid"
                        />
                        {errors.password && (
                          <p style={{ color: "red", marginTop: "5px" }}>
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-3 row mt-4">
                        <div className="col-4"></div>
                        <div className="col-4 text-end">
                          <button
                            disabled={isLoadingLogin}
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            {isLoadingLogin ? (
                              <Spinner size="sm" color="light"></Spinner>
                            ) : (
                              "Log In"
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="form-group mb-0 row">
                        <div className="col-12 mt-4">
                          <Link to="/signup" className="">
                            Register as Super Admin?
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
    </React.Fragment>
  );
};

export default Login;
