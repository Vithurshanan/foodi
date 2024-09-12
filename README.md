Foodi: Food Delivery E-Commerce Website
        Foodi is a modern food delivery e-commerce platform designed to connect customers with a 
        wide range of food vendors. Built using the MERN stack (MongoDB, Express.js, React.js, 
        and Node.js), Foodi offers a seamless and interactive experience for users looking to 
        browse, order, and manage their food deliveries online.
        
Features
        	User-Friendly Interface: Easy-to-navigate interface built with React.js, 
                                         providing an intuitive browsing and ordering experience.
        	Search and Filter Options: Quickly find your favorite food items or 
                                         restaurants with advanced search and filter functionalities.
        	Cart Management: Add items to your cart, view and modify your selections 
                                 before proceeding to checkout.
        	Order Processing: Seamless checkout process with real-time order tracking.
        	User Accounts: Create and manage user profiles, view order history, 
                                 and update personal information.
         
Technologies Used
        	Frontend:
        		React.js: For building dynamic and responsive user interfaces.
        		HTML: For structuring web content.
        		CSS: For styling and layout.
        	Backend:
        		Node.js: Server-side JavaScript runtime environment.
        		Express.js: Web application framework for Node.js, handling API requests and server logic.
        	Database:
        		MongoDB: NoSQL database for storing user data, orders, and product information.

Installation

Prerequisites
                Node.js (v14 or higher)
                MongoDB (Local installation or Atlas cloud service)

                Clone the Repository
                 git clone https://github.com/Vithurshanan/foodi.git
                 cd foodi
        
Install Dependencies:  
                Client-Side:

                cd foodi-client
                npm install
                
Server-Side:

                cd ../foodi-server
                npm install
                
Environment Variables:
                Create a .env file in the foodi-server directory with the following variables:
                
                        MONGO_URI=<Your MongoDB URI>
                        JWT_SECRET=<Your JWT Secret>
                        PORT=5000
                
Run the Application:
                
Start the Server

                cd foodi-server
                npm start
                
Start the Client
                In a new terminal window:
                
                cd foodi-client
                npm start
        
        
The client-side application will be accessible at http://localhost:3000 and the server-side at http://localhost:5000.
        
Usage
        Browse: Explore various restaurants and food items on the homepage.
        Search: Use the search bar to find specific items or restaurants.
        Order: Add items to your cart, proceed to checkout, and place your order.
        Manage: Log in to manage your profile and view order history.
        
Contributing
        Feel free to contribute by opening issues, submitting pull requests, or providing feedback. Contributions are welcome to improve the functionality and user experience of Foodi.
        
