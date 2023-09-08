# GroceryEase: Your Ultimate Online Grocery Shopping Solution


GroceryEase is a web application that modernizes the way you shop for groceries. It provides a convenient and user-friendly platform for ordering groceries online, with two unique ordering methods. Whether you prefer manual selection through a user interface or the efficiency of image-based ordering, GroceryEase has you covered.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [AWS Services](#aws-services)


## Features

- **Manual Selection**: Browse through a wide range of groceries and add items to your cart with ease using our user-friendly interface.
- **Image-Based Ordering**: Snap a picture of your shopping list, and let our application create an order for you using advanced text extraction technology.
- **Real-Time Cart Management**: Customize your cart in real-time, view item details, and manage quantities effortlessly.
- **AWS Integration**: Our backend relies on various AWS services to ensure efficiency, scalability, and reliability.
- **Advanced Text Extraction**: We leverage AWS Textract to convert images of grocery lists into text-based orders.

## Tech Stack

- **Frontend**: Built with React, offering a responsive and intuitive user interface.
- **Backend**: Hosted on AWS, powered by AWS EC2, AWS Lambda, API Gateway, AWS DynamoDB, AWS S3, AWS SNS, and AWS Textract.
- **Deployment**: Deployed on AWS for scalability and reliability.


## Usage

- **Manual Selection**: Browse the available products, select items, and add them to your cart.
- **Image-Based Ordering**: Take a photo of your grocery list, upload it, and let the application create an order for you.
- **Real-Time Cart Management**: Customize your cart, review items, and proceed to checkout when you're ready.


## AWS Services
GroceryEase leverages several AWS services for its functionality:

- **EC2**: Provides scalable compute resources for the backend.
- **Lambda**: Executes code in response to events, such as image uploads and order processing.
- **API Gateway**: Manages APIs and integrates with other AWS services.
- **DynamoDB**: A NoSQL database used for storing user and order data.
- **S3**: Stores user-uploaded images of grocery lists.
- **SNS**: Provides messaging and event-driven communication between components.
- **Textract**: Utilized for advanced image-to-text functionality to convert grocery lists into orders.
