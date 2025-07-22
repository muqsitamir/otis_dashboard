import React, { useState } from "react";
import Joi from "joi-browser";

function Form({ schema, doSubmit }) {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [isHidden, setIsHidden] = useState(true);

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const singleFieldSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, singleFieldSchema);
    return error ? error.details[0].message : null;
  };

  const handleChange = ({ currentTarget: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);

    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    const newData = { ...data, [input.name]: input.value };
    setData(newData);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return null;

    const formErrors = {};
    for (const item of error.details) {
      formErrors[item.path[0]] = item.message;
    }
    return formErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors || {});
    if (formErrors) return;
    doSubmit(event);
  };

  const changeHidden = (event) => {
    event.preventDefault();
    setIsHidden(!isHidden);
  };

  const onIconClick = (event) => {
    event.preventDefault();
    setIsHidden(!isHidden);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Example field (adjust as needed) */}
      <input
        name="username"
        value={data.username || ""}
        onChange={handleChange}
        type={isHidden ? "password" : "text"}
      />
      {errors.username && <div className="error">{errors.username}</div>}

      <button onClick={onIconClick}>{isHidden ? "Show" : "Hide"}</button>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
