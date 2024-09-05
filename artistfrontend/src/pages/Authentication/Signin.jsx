import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
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
import { toast } from "react-toastify";
import { useSignIn } from "../../services/fetchers/auth/auth";
import { useGetUserProfile } from "../../services/fetchers/auth/auth";
import {
  useRegisterUser,
  useUpdateeUser,
} from "../../services/fetchers/users/users";
import {
  useRegisterArtist,
  useUpdateeArtist
  } from "../../services/fetchers/artist/artist";

const Signin = () => {
  const { mutateAsync, isLoading } = useSignIn();
  const { mutateAsync: mutateAsyncRegisterUser, isLoading: isLoading1 } =
    useRegisterUser();
  const { mutateAsync: mutateAsyncUpdateUser, isLoading: isLoading2 } =
    useUpdateeUser();
  const { mutateAsync: mutateAsyncCreateArtist, isLoading: isLoading3 } =
  useRegisterArtist();
  const { mutateAsync: mutateAsyncUpdateArtist, isLoading: isLoading4 } =
  useUpdateeArtist();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();
  const location = useLocation();
  const { userData,isArtist } = location.state || {};
  React.useEffect(() => {
    if (userData?.id) {
      if(isArtist){
        let [first_name,last_name]=userData.name.split(" ")
        setValue("first_name", first_name);
        setValue("last_name", last_name);
        setValue("no_of_albums_released", userData.no_of_albums_released);
        setValue("first_release_year", userData.first_release_year);
      }
      else{
        setValue("first_name", userData.first_name);
        setValue("last_name", userData.last_name);
      }
      setValue("id", userData.id);
      setValue("email", userData.email);
      setValue("role_type", userData.role_type);
      // setValue("first_name", userData.first_name);
      // setValue("last_name", userData.last_name);
      setValue("phone", userData.phone);
      setValue("dob", userData.dob);
      setValue("gender", userData.gender);
      setValue("address", userData.address);
    }
  }, [userData, setValue,isArtist]);

  const navigate = useNavigate();
  const userProfile = useGetUserProfile();
  const onSubmit = async (data) => {
    try {
      console.log(isArtist)
      if(isArtist){
        if(userData.id){
          data.user_id=userData.id
          const responseData = await mutateAsyncUpdateArtist(data);
          toast.success("Updated successfully!");
          navigate("/artists");
        }
        else{
        // artist section work
        // data.role_type='artist'
        const responseData = await mutateAsyncCreateArtist(data);
        toast.success("Created successfully!");
        navigate("/artists");
        }
      }
      else{
      if (
        userProfile?.isSuccess &&
        userProfile.data?.role_type === "super_admin"
      ) {
        
       
        if (data?.id) {
          const responseData = await mutateAsyncUpdateUser(data);
          toast.success("Updated successfully!");
          navigate("/users");
        } else {
          const responseData = await mutateAsyncRegisterUser(data);
          toast.success("Successfully registered!");
          navigate("/users");
        }
      
      } else {
        const responseData = await mutateAsync(data);
        toast.success("Successfully registered!");
        navigate("/login");
      }
    }
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
console.log(userData,isArtist)
  return (
    <div className="account-pages my-2 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <Card className="overflow-hidden">
              <CardBody className="pt-0">
                <h3 className="text-center mt-5 mb-4">
                  {userData?.id ? "Update User" : "Register"}
                </h3>
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
                      {!userData?.id && (
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
                      )}
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
                    {isArtist &&<Row>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                              Number of Albums Released
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-solid"
                            {...register("no_of_albums_released", {
                              required: "Number of albumns released is required",
                              min:{
                                value:0,
                                message:"It cannot be less than 0"
                              }
                            })}
                            style={{
                              border: errors?.no_of_albums_released ? "1px solid red" : "",
                            }}
                          />
                          {errors.no_of_albums_released && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.no_of_albums_released.message}
                            </p>
                          )}
                          {errors.no_of_albums_released && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.no_of_albums_released[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                          First Release Year
                          </label>
                          <input
                            type="number"
                        
                            className="form-control form-control-solid"
                            {...register("first_release_year", {
                                                        })}
                            style={{
                              border: errors?.first_release_year ? "1px solid red" : "",
                            }}
                          />
                          {errors.first_release_year && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.first_release_year.message}
                            </p>
                          )}
                          {errors.first_release_year && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.first_release_year[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>}
                    {userProfile?.isSuccess &&
                      userProfile.data?.role_type === "super_admin" &&isArtist!==true && (
                        <Row>
                          <Col>
                            <div className="mb-3">
                              <label className="col-form-label fw-bold fs-6">
                                Role Type
                              </label>
                              <select
                                className="form-control form-control-solid"
                                {...register("role_type", {
                                  required: "Role is required",
                                })}
                                style={{
                                  border: errors?.role_type
                                    ? "1px solid red"
                                    : "",
                                }}
                              >
                                <option value="">Select Role</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="artist_manager">
                                  Artist Manager
                                </option>
                                <option value="artist">Artist</option>
                              </select>
                              {errors.role_type && (
                                <p style={{ color: "red", marginTop: "5px" }}>
                                  {errors.role_type.message}
                                </p>
                              )}
                              {errors.role_type && (
                                <p style={{ color: "red", marginTop: "5px" }}>
                                  {errors.role_type[0]}
                                </p>
                              )}
                            </div>
                          </Col>
                        </Row>
                      )}

                    <div className="d-flex justify-content-center mt-4">
                      <button
                        className="btn btn-primary btn-lg"
                        type="submit"
                        disabled={isLoading || isLoading1 || isLoading2||isLoading3||isLoading4}
                      >
                        {isLoading || isLoading1 || isLoading2 ||isLoading3||isLoading4 ? (
                          <>
                            <Spinner size="sm" color="light" />
                          </>
                        ) : userData?.id ? (
                          "Update"
                        ) : (
                          "Register"
                        )}
                      </button>
                    </div>
                    {!userProfile?.isSuccess && (
                      <div className="form-group mb-0 row">
                        <div className="col-12 mt-4">
                          <Link to="/login" className="">
                            Login?
                          </Link>
                        </div>
                      </div>
                    )}
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
