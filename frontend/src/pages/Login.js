import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Create an object with the login data
    const loginData = {
      body: JSON.stringify({
        email: email,
        password: password
      })
    };
    const url = process.env.REACT_APP_API_GATEWAY_URL+'/login';
    // Make the HTTP request to the backend
    axios.post(url, loginData)
      .then(response => {
        if (response.data === "Invalid email or password") {
          console.log(response.data);
        }
        toast.success("Login Successful");
        navigate("/homepage", { state: { email: email } });
        // Save the JWT token in local storage
        localStorage.setItem('token', response.data.token);
      })
      .catch(error => {
        console.log(error);
        toast.error("Error while logging in");
      });
  };

  return (
    <div>
      <Flex
        height="95vh"
        justify="center"
        align="center"
        bgSize="cover"
        px={4}
      >
        <VStack spacing={4}>
          <Heading>Login: </Heading>

          <HStack justifyContent="space-between">
            <Text><strong>Email:</strong></Text>
            <Input
              type="text"
              mb={4}
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Text color="red"></Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text><strong>Password:</strong></Text>
            <Input
              type="password"
              mb={4}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Text color="red"></Text>
          </HStack>

          <Button
            bgGradient='linear(to-r, teal.500, green.500)'
            _hover={{
              bgGradient: 'linear(to-r, red.500, yellow.500)'
            }}
            color='white'
            marginRight={2}
            onClick={handleLogin}
          >
            Submit
          </Button>
          <Text >
            Don't have an account?
          </Text>
          <NavLink to="/" style={{ textDecoration: 'underline', color: 'blue' }}>
            Go to Registration
          </NavLink>
          <ToastContainer />
        </VStack>
      </Flex>
    </div>
  );
}

export default Login;
