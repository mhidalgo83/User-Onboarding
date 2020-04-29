import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as yup from "yup";
import axios from "axios";

const Wrapper = styled.form``;

const Error = styled.p`
  font-size: 0.8rem;
  width: 100%;
  color: red;
`;

const Input = styled.input`
  display: block;
  width: 50%;
  margin: 2% 0;
`;

const Label = styled.label`
  margin: auto;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  justify-content: center;
`;

// const Button = styled.button.attrs(() => ({
//   type: "disabled",
// }))`
//   background-image: none;
//   background-color: white;
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   color: rgba(0, 0, 0, 0.1);
//   cursor: not-allowed;
// `;

const Form = () => {
  const [post, setPost] = useState();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field"),
    email: yup
      .string()
      .email("Must be a valid email address")
      .required("Must be a valid email address"),
    password: yup.string().required("Password is required to sign up"),
    terms: yup.boolean().oneOf([true, "Please accept terms and conditions"]),
  });

  const inputChange = (e) => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    };
    validateChange(e);
    setFormState(newFormData);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then((res) => {
        console.log(res);
        setPost(res.data);
        setFormState({
          name: "",
          email: "",
          password: "",
          terms: "",
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
    console.log("submitted");
  };

  const validateChange = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
      });
  };

  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      setIsButtonDisabled(!valid);
    });
  }, [formState]);

  return (
    <Wrapper onSubmit={formSubmit}>
      <Label htmlFor="name">
        Name:{" "}
        <Input
          id="name"
          value={formState.name}
          name="name"
          type="text"
          onChange={inputChange}
        />
        {errors.name.length > 0 ? <Error>{errors.name}</Error> : null}
      </Label>
      <Label htmlFor="email">
        Email:{" "}
        <Input
          id="email"
          value={formState.email}
          name="email"
          type="email"
          onChange={inputChange}
        ></Input>
        {errors.email.length > 0 ? <Error>{errors.email}</Error> : null}
      </Label>
      <Label htmlFor="password">
        Password:{" "}
        <Input
          id="password"
          value={formState.password}
          name="password"
          type="password"
          onChange={inputChange}
        ></Input>
        {errors.password.length > 0 ? (
          <Error className="error">{errors.password}</Error>
        ) : null}
      </Label>
      <CheckboxLabel htmlFor="terms">
        Terms and Conditions
        <input
          type="checkbox"
          name="terms"
          value={formState.terms}
          onChange={inputChange}
        ></input>
      </CheckboxLabel>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <button disabled={isButtonDisabled}>Submit</button>
    </Wrapper>
  );
};

export default Form;
