import { Button, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Registration(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate ();

  const handleRegistration = () => {
    // Check if any field is empty
    if (!name || !email || !password || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Create an object with the registration data
    const registrationData = {
      
        "body": {
      name: name,
      email: email,
      password: password,
      phone: phone}
    };
    console.log(registrationData)
    // Make the HTTP request to the backend
    const url = process.env.REACT_APP_API_GATEWAY_URL+'/registration';
    console.log("Url"+url)
    axios.post(url, registrationData)
      .then(response => {
        console.log(response.data);
        toast.success("Registration Successful");
        navigate("/login");
      })
      .catch(error => {
        console.log(error);
        toast.error("Error while Registering"+error);
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
          {/* Heading */}
          <Heading>Registration:</Heading>

          <HStack justifyContent="space-between">
            <Text><strong>Name:</strong></Text>
            {/* Input for Name */}
            <Input
              type="text"
              mb={4}
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Text color="red"></Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text><strong>Email:</strong></Text>
            {/* Input for Email */}
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
            {/* Input for Password */}
            <Input
              type="password"
              mb={4}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Text color="red"></Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text><strong>Phone:</strong></Text>
            {/* Input for Location */}
            <Input
              type="text"
              mb={4}
              placeholder="Enter your location"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <Text color="red"></Text>
          </HStack>

          {/* Registration Submit Button */}
          <Button
            bgGradient='linear(to-r, teal.500, green.500)'
            _hover={{
              bgGradient: 'linear(to-r, red.500, yellow.500)'
            }}
            color='white'
            marginRight={2}
            onClick={handleRegistration}
          >
            Submit
          </Button>
          <Text>
            Already have an account?
          </Text>
          {/* Link to Login page */}
          <NavLink to="/login" style={{ textDecoration: 'underline', color: 'blue' }}>
            Go to Login
          </NavLink>

          {/* ToastContainer for displaying notifications */}
          <ToastContainer />
        </VStack>
      </Flex>
    </div>
  );
}

export default Registration;
