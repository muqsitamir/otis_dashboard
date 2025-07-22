import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Joi from "joi";

// @mui material components
import Card from "@mui/material/Card";

// Otis Admin PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/lums.jpg";

// Backend URL
import backendUrl from "config";

function Basic() {
  const [data, setData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().min(8).required().label("Password"),
  };
  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(data, options);

    if (!error) return null;

    const newErrors = {};
    error.details.forEach((item) => {
      newErrors[item.path[0]] = item.message;
    });

    return newErrors;
  };

  const handleChange = ({ target: input }) => {
    const newData = { ...data, [input.name]: input.value };
    setData(newData);

    const obj = { [input.name]: input.value };
    const subSchema = { [input.name]: schema[input.name] };
    const { error } = Joi.object(subSchema).validate(obj);
    const newErrors = { ...errors };
    if (error) newErrors[input.name] = error.details[0].message;
    else delete newErrors[input.name];
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${backendUrl}/accounts/api/token/login/`, data);
      localStorage.setItem("token", res.data.auth_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const { state } = location;
      navigate(state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      const serverError = err.response?.data?.non_field_errors?.[0] || "Login failed";
      setErrors({ ...errors, password: serverError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                name="username"
                value={data.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                value={data.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
