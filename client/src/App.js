import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import TransactionHistory from './Pages/Transaction-history';
import Deposit from './Pages/Deposit';
import Transfer from './Pages/Transfer';
import RequestFunds from './Pages/RequestFunds';
import Airtime from './Pages/Airtime';
import Data from './Pages/Data';
import Loans from './Pages/Loans';
import Cards from './Pages/Cards';
import Rewards from './Pages/Rewards';
import PseudoDashboard from './Pages/PseudoDashboard';
import ProfilePage from './Pages/ProfileUpdate';

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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> 
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/pseudodashboard" element={<ProtectedRoute><PseudoDashboard /></ProtectedRoute>} />
                    <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
                    <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
                    <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
                    <Route path="/request-funds" element={<ProtectedRoute><RequestFunds /></ProtectedRoute>} />
                    <Route path="/airtime" element={<ProtectedRoute><Airtime /></ProtectedRoute>} />
                    <Route path="/data" element={<ProtectedRoute><Data /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/logout" element={<Navigate to="/login" replace />} />
                    <Route path="/loans" element={<ProtectedRoute><Loans/></ProtectedRoute>}/>
                    <Route path="/cards" element={<ProtectedRoute><Cards/></ProtectedRoute>}/>
                    <Route path="/rewards" element={<ProtectedRoute><Rewards/></ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>

                </Routes>
            </div>
        </Router>
    );
}

export default App;
