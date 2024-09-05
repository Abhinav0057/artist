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
import { useGetUserProfile } from "../../services/fetchers/auth/auth";
import {
    useCreateSong,
    useUpdateSong
    } from "../../services/fetchers/artist/artist";
    import { toast } from "react-toastify";

const ArtistSongForm = () => {
  const userProfile = useGetUserProfile();
    const { mutateAsync, isLoading } =useCreateSong();
    const { mutateAsync:mutateAsyncUpdate, isLoading:isLoading1 } =useUpdateSong();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();
  const location = useLocation();

  const { userData } = location.state || {};
  React.useEffect(() => {
    if (userData?.id) {
   
  
      setValue("id", userData.id);
      setValue("album_name", userData.album_name);
      setValue("title", userData.title);
      setValue("genre", userData.genre);
      
    }
  }, [userData, setValue]);

  const navigate = useNavigate();
//   const userProfile = useGetUserProfile();
  const onSubmit = async (data) => {
    try {
    
    
        if(userData?.id){
              
          const responseData = await mutateAsyncUpdate(data);
          toast.success("Updated created!");

          navigate(`/my/songs/${userProfile.data.id}`);
        }
        else{       
          const responseData = await mutateAsync(data);
          toast.success("Successfully created!");

          navigate(`/my/songs/${userProfile.data.id}`);
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

  return (
    <div className="account-pages my-2 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <Card className="overflow-hidden">
              <CardBody className="pt-0">
                <h3 className="text-center mt-5 mb-4">
                  {userData?.id ? "Update Song" : "Create Song"}
                </h3>
                <div className="p-1">
                  <form onSubmit={handleSubmit(onSubmit)}>


                    <Row>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            {...register("title", {
                              required: "Title is required",
                            })}
                            style={{
                              border: errors?.title ? "1px solid red" : "",
                            }}
                          />
                          {errors.title && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.title.message}
                            </p>
                          )}
                          {errors.title && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.title[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <label className="col-form-label fw-bold fs-6">
                            Album Name
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            {...register("album_name", {
                              required: "Album Name is required",
                            })}
                            style={{
                              border: errors?.album_name ? "1px solid red" : "",
                            }}
                          />
                          {errors.album_name && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.album_name.message}
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
                            Genre
                          </label>
                          <select
                            className="form-control form-control-solid"
                            {...register("genre", {
                              required: "Genre is required",
                            })}
                            style={{
                              border: errors?.genre ? "1px solid red" : "",
                            }}
                          >
                            <option value="">Select Genre</option>
                            <option value="rnb">Rnb</option>
                            <option value="country">Country</option>
                            <option value="classic">Classic</option>
                            <option value="rock">Rock</option>
                            <option value="jazz">Jazz</option>
                          </select>
                          {errors.genre && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.genre.message}
                            </p>
                          )}
                          {errors.gender && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {errors.genre[0]}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-center mt-4">
                      <button
                        className="btn btn-primary btn-lg"
                        type="submit"
                        disabled={isLoading||isLoading1}
                      >
                        {isLoading || isLoading1?(
                          <>
                            <Spinner size="sm" color="light" />
                          </>
                        ):"Save"}
                      </button>
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

export default ArtistSongForm;
