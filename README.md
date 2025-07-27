# VendorMart - B2B Marketplace

A full-stack B2B marketplace application connecting street food vendors with raw material suppliers. Built with React, TypeScript, Tailwind CSS, and Node.js.

## 🚀 Features

### ✅ Implemented Features

#### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Vendor/Supplier)
- **Protected routes** with automatic redirects
- **User registration and login** with validation

#### Vendor Dashboard
- **Real-time statistics** (orders, suppliers, spending, ratings)
- **Quick Actions** with navigation to key features:
  - Find new suppliers → Navigate to supplier listing
  - Track pending orders → Filter orders by status
  - Check messages → Go to chat interface
  - Update profile → Access profile management
- **Recent orders** with status tracking
- **Responsive design** with modern UI components

#### Profile Management
- **Complete profile editing** (name, phone, password)
- **Password change** with current password verification
- **Form validation** with error handling
- **Success/error notifications** using toast messages
- **Account information display** (role, member since, etc.)

#### Messaging System
- **Real-time chat interface** between vendors and suppliers
- **Conversation management** with unread message counts
- **Message history** with timestamps and read status
- **Search functionality** for conversations
- **Responsive chat UI** with message bubbles
- **Auto-mark as read** when viewing conversations

#### Order Management
- **Order listing** with status filtering (pending, confirmed, shipped, delivered)
- **URL-based filtering** (e.g., `/vendor/orders?status=pending`)
- **Order details** with item breakdown and pricing
- **Contact supplier** directly from order view
- **Status badges** with color coding
- **Currency formatting** for Indian Rupees

#### Navigation & UX
- **Protected route system** with role-based access
- **Loading states** with spinners and skeleton screens
- **Error handling** with user-friendly messages
- **Toast notifications** for success/error feedback
- **Responsive sidebar** with collapsible navigation

### 🔧 Technical Implementation

#### Frontend (React + TypeScript)
- **Modern React patterns** with hooks and functional components
- **TypeScript** for type safety and better development experience
- **ShadCN UI** components for consistent design
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **React Query** for data fetching and caching
- **Context API** for global state management

#### Backend (Node.js + Express)
- **RESTful API** with proper HTTP status codes
- **MongoDB** with Mongoose ODM
- **JWT authentication** with secure token handling
- **Input validation** using express-validator
- **Error handling** with proper error responses
- **Rate limiting** for API protection
- **CORS configuration** for frontend integration

#### Database Models
- **User Model**: Authentication, roles, profile data
- **Message Model**: Chat messages with conversation grouping
- **Order Model**: Order management with status tracking

#### API Endpoints
- **Authentication**: `/api/auth/signin`, `/api/auth/signup`
- **Profile**: `/api/profile` (GET, PUT)
- **Messages**: `/api/messages/conversations`, `/api/messages/conversations/:id`
- **Orders**: `/api/orders` (GET, POST), `/api/orders/:id/status`
- **Suppliers**: `/api/suppliers` (vendors only)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Start development server
npm run dev
```

### Quick Start (Recommended)
```bash
# On macOS/Linux
chmod +x start-dev.sh
./start-dev.sh

# On Windows
start-dev.bat
```

### Environment Variables
Create a `.env` file in the server directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vendormart
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 📱 Usage

### For Vendors
1. **Sign up/Login** with vendor role
2. **Dashboard**: View statistics and quick actions
3. **Find Suppliers**: Browse available suppliers
4. **Place Orders**: Create orders with suppliers
5. **Track Orders**: Monitor order status and history
6. **Chat**: Communicate with suppliers
7. **Profile**: Manage account settings

### For Suppliers
1. **Sign up/Login** with supplier role
2. **Dashboard**: View incoming orders and statistics
3. **Manage Orders**: Update order status and track deliveries
4. **Chat**: Communicate with vendors
5. **Profile**: Manage account settings

## 🔮 Future Features (Modular Design)

The application is structured to easily accommodate future AI-powered features:

### 🤖 AI-Powered Supplier Recommendations
- Use past order data and location matching
- Implement machine learning for supplier suggestions
- Add category-based filtering

### 📈 Price Trend Forecasting
- Integrate market data APIs
- Implement price prediction algorithms
- Add price alerts and notifications

### 💬 AI Chat Assistant
- Auto-responses for common queries
- Order status automation
- FAQ handling

### 🛒 Smart Order Optimization
- Bundle suggestions for cost efficiency
- Route optimization for deliveries
- Inventory management integration

## 🏗️ Project Structure

```
mandee-deals/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API client
│   ├── pages/              # Page components
│   └── App.tsx            # Main app component
├── server/
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   └── server.js         # Express server
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy the server directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### Common Issues

#### Connection Refused Error
If you see `ERR_CONNECTION_REFUSED` errors:

1. **Ensure backend is running**:
   ```bash
   cd server
   npm run dev
   ```
   You should see: `Server running on port 3001`

2. **Check MongoDB connection**:
   - Ensure MongoDB is installed and running
   - Check your `.env` file has correct `MONGODB_URI`

3. **Verify ports**:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:5173`

#### CORS Errors
If you see CORS errors:
- The backend is configured to allow requests from `localhost:5173`
- Ensure you're accessing the frontend from the correct URL

#### Authentication Issues
- Check browser console for detailed error messages
- Verify JWT_SECRET is set in your `.env` file
- Ensure all required fields are filled in signup/signin forms

### Health Check
Test if the backend is running:
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"OK","message":"VendorMart API is running"}`

## 🆘 Support

For support and questions, please open an issue in the repository.
