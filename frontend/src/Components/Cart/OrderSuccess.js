import React, { Fragment, useState, } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const OrderSuccess = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState('');
    sessionStorage.removeItem('orderInfo');
    // localStorage.clear();
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingInfo');

    const navigate = useNavigate();

    const payment = async (formData) => {
        // ... your existing payment logic remains unchanged
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value); // Update the email state onChange
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('email', email);
        payment(formData);
    };

    return (
        <Fragment>
            <MetaData title={'Order Success'} />

            <div className="row justify-content-center">
                <div className="col-6 mt-5 text-center">
                    <img
                        className="my-5 img-fluid d-block mx-auto"
                        src="/images/order_success.png"
                        alt="Order Success"
                        width="200"
                        height="200"
                    />

                    <h2>Your Order has been placed successfully.</h2>

                    {/* Input field for email */}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange} // Binding onChange event to update email state
                    />

                    <Link to="/orders/me">Go to Orders</Link>
                </div>
            </div>
        </Fragment>
    );
};

export default OrderSuccess;
