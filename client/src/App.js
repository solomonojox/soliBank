import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Deposit from './Pages/Deposit';
import Transfer from './Pages/Transfer';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import RequestFunds from './Pages/RequestFunds';
import Data from './Pages/Data';
import Airtime from './Pages/Airtime';

import { Navigate } from 'react-router-dom';


// ProtectedRoute
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> 
                    <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
                    <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
                    <Route path="/request-funds" element={<ProtectedRoute><RequestFunds /></ProtectedRoute>} />
                    <Route path="/airtime" element={<ProtectedRoute><Airtime /></ProtectedRoute>} />
                    <Route path="/data" element={<ProtectedRoute><Data /></ProtectedRoute>} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
