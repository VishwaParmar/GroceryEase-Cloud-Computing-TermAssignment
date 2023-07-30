import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Flex, VStack, Heading, Text, Button, Select } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HomePage(props) {
  const [groceryItems, setGroceryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const [selectedCategory, setSelectedCategory] = useState('All'); // State to store the selected category
  const [uploadResponse, setUploadResponse] = useState(null); // State to store the image upload response
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item
  const [orderedItems, setOrderedItems] = useState([]);


  const location = useLocation();
  const navigate = useNavigate();
 

  useEffect(() => {
    // Fetch grocery items when the component mounts and whenever the selectedCategory changes
    fetchGroceryItems({ category: selectedCategory });
  }, [selectedCategory]);

  const handleLogout = () => {
    // Make a POST request to the logout API endpoint
    navigate("/login");
  };



  const fetchGroceryItems = async ({ category }) => {
    try {
      const url = process.env.REACT_APP_API_GATEWAY_URL+'/getitems';
      const response = await axios.get(url, { category }); // Send the category in the request body
      const data = JSON.parse(response.data.body);
      const updatedGroceryItems = data.map((item) => ({ ...item, count: 0 }));
      setGroceryItems(updatedGroceryItems);
  
      console.log(data);
    } catch (error) {
      console.error('Error fetching grocery items:', error);
    }
  };
  
  
  // Function to handle image file selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };


// Function to handle image upload
const handleImageUpload = () => {
  if (selectedImage) {
    // Read the selected image file as a data URL
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Base64-encoded image data
        const base64Image = reader.result.split(',')[1];

        console.log('Image data to be sent:', base64Image); // Log the image data before sending

        // Replace 'YOUR_IMAGE_UPLOAD_ENDPOINT' with the actual API endpoint to handle image uploads on the server
        const url = process.env.REACT_APP_API_GATEWAY_URL+'/upload';

        // Get the name of the uploaded image (you can replace 'selectedImage.name' with the actual method to get the name)
        const imageName = selectedImage.name;

        // Prepare the request body with the required format
        const requestBody = {
          body: {
            image_data: base64Image,
            image_name: imageName
          }
        };

        const response = await axios.post(url, requestBody);

        // Handle the success response
        console.log('Response:', response.data);
      //  setUploadResponse(response.data.body);
        // Clean the response data by removing any occurrences of "\n"
        const responseData = response.data.body
        const cleanedResponse = response.data.body.replace(/\n/g, '');

        // Set the cleaned upload response in the state to display it on the page
        setUploadResponse(cleanedResponse);
        toast.success('Image upload successful');
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadResponse('Image upload failed');
        toast.error('Image upload failed');
      }
    };

    // Read the selected image file as a data URL
    reader.readAsDataURL(selectedImage);
  }
};
  // Function to handle category selection
  const handleConfirmOrder = async () => {
    try {
      // Prepare the request body with the required format
      const userEmail = location.state.email;
      const uploadResponse = {'email': 'parmarvishwa02@gmail.com', 'Items': 'Milk 1 Potato  2'};
  
      const requestBody = {
        body: JSON.stringify({
          email: userEmail,
          Items: uploadResponse.Items,
        }),
      };
  
      console.log("Request Front", requestBody);
  
      // Replace 'YOUR_ORDER_CONFIRMATION_API_ENDPOINT' with the actual API endpoint to handle order confirmations on the server
       const url = process.env.REACT_APP_API_GATEWAY_URL+'/order-confirmation';
  
      // Make the POST request to the API with the request body
      const response = await axios.post(url, requestBody);
  
      // Handle the success response
      console.log('Order Confirmation Response:', response.data);
      toast.success('Order confirmed!');
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Error confirming order');
    }
  };
  
  const handleAddItem = (item) => {
    const updatedItems = groceryItems.map((gi) =>
      gi === item ? { ...gi, count: gi.count + 1 } : gi
    );
    setGroceryItems(updatedItems);
    setSelectedItem(item);
  };
  // Function to handle adding an item
  const handleOrder = async () => {
    // Filter the items that have a count greater than zero (i.e., added to the order)
    const addedItems = groceryItems.filter((item) => item.count > 0);
  
    // Update the state to keep track of the added items and their counts
    setOrderedItems(addedItems);
  
    try {
      // Prepare the request body with the required format
      const userEmail = location.state.email;

      const orderedItemsString = addedItems
      .map((item) => `${item.Product} ${item.count}`)
      .join(' ');
  
      const requestBody = {
        body: JSON.stringify({
          email: userEmail,
          Items: orderedItemsString,
        }),
      };
  
      console.log(requestBody)
  
      // Replace 'YOUR_ORDER_CONFIRMATION_API_ENDPOINT' with the actual API endpoint to handle order confirmations on the server
      const url = process.env.REACT_APP_API_GATEWAY_URL+'/order-confirmation';
  
      // Make the POST request to the API with the request body
      const response = await axios.post(url, requestBody);
  
      // Handle the success response
      console.log('Order Confirmation Response:', response.data);
      toast.success('Order confirmed!');
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Error confirming order');
    }
  };
  

  return (
    <Flex  justify="center" align="center" bg="teal.200" px={4} >
      <VStack spacing={10} bg="white" borderRadius="lg" p={6} boxShadow="xl">
        {/* Heading */}
        <Heading as="h1" size="xl">
          Welcome to Grocery Shopping App
        </Heading>
        <Text fontSize="lg" fontWeight="bold" color="gray.600">
          Hello, {location.state.email}
        </Text>

        <VStack spacing={4} width="100%">
          <Text fontWeight="bold" fontSize="xl">
            Available Grocery Items
          </Text>

          {/* Dropdown Menu for Category Filter */}
         

          {/* Table */}
          <Table variant="striped" width="100%">
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th>Brand</Th>
                <Th>Inventory</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Mapping over grocery items array to display available items */}
              {groceryItems.map(item => (
                <Tr key={item.Product}>
                  <Td>{item.Product}</Td>
                  <Td>${item.Price}</Td>
                  <Td>{item.Brand}</Td>
                  <Td>{item.Inventory}</Td>
                  <Td>
                  {/* Add a button for each item */}
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleAddItem(item)}
                  >
                    Add
                  </Button>
                  <Text ml={2} fontWeight="bold" color="teal.500">
                    {/* Display the count beside the button */}
                    {item.count}
                  </Text>
                </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
{/* "Order" button */}
<Button
      bgGradient="linear(to-r, teal.500, green.500)"
      _hover={{
        bgGradient: 'linear(to-r, red.500, yellow.500)',
      }}
      color="white"
      width="100%"
      onClick={handleOrder} // Call handleOrder function on button click
    >
      Order
    </Button>

    {/* Display the ordered items and their counts */}
    {orderedItems.length > 0 && (
      <VStack mt={4} align="left" spacing={2}>
        <Text fontWeight="bold" fontSize="lg">
          Ordered Items:
        </Text>
        {orderedItems.map((item) => (
          <Text key={item.Product}>
            {item.Product}  {item.count}
          </Text>
        ))}
      </VStack>
    )}

          {/* Image Upload Button and Input */}
          <input type="file" onChange={handleImageSelect} />
          <Button
            bgGradient="linear(to-r, teal.500, green.500)"
            _hover={{
              bgGradient: 'linear(to-r, red.500, yellow.500)',
            }}
            color="white"
            width="100%"
            onClick={handleImageUpload} // Call handleImageUpload function on button click
          >
            Upload Image
          </Button>
          {/* Display the upload response */}
          {uploadResponse && (
            <VStack>
              <Text fontWeight="bold" color="green">
                Upload successful
              </Text>
              {/* Split the cleaned response by "\n" and print each part on a new line */}
              {uploadResponse.split('\n').map((line, index) => (
                <Text key={index} whiteSpace="pre-wrap">
                  {line}
                </Text>
              ))}
              {/* "Confirm Order" button */}
            <Button
              bgGradient="linear(to-r, teal.500, green.500)"
              _hover={{
                bgGradient: 'linear(to-r, red.500, yellow.500)',
              }}
              color="white"
              width="100%"
              onClick={handleConfirmOrder}
            >
              Confirm Order
            </Button>
            
            </VStack>
          )}

          {/* Logout Button */}
          <Button
            bgGradient="linear(to-r, teal.500, green.500)"
            _hover={{
              bgGradient: 'linear(to-r, red.500, yellow.500)',
            }}
            color="white"
            width="100%"
            onClick={handleLogout} // Call handleLogout function on button click
          >
            Logout
          </Button>

          {/* ToastContainer for displaying notifications */}
          <ToastContainer />
        </VStack>
      </VStack>
    </Flex>
  );
}

export default HomePage;
