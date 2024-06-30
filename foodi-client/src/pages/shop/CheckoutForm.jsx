import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FaPaypal } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CheckoutForm = ({ price, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [cartError, setCartError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch the client secret from your server when price changes
    if (typeof price === 'number' && price >= 1) {
      axiosSecure.post('/create-payment-intent', { price })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(error => {
          console.error('Error fetching client secret:', error);
        });
    }
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || 'anonymous',
            email: user?.email || 'unknown',
          },
        },
      });

      if (error) {
        console.error('Error confirming card payment:', error.message);
        setCartError(error.message);
      } else {
        //console.log('PaymentIntent:', paymentIntent);
        setCartError('Payment successful!');
        // Handle successful payment here
      }
      console.log(paymentIntent)
      if(paymentIntent.status === "succeeded"){
        console.log(paymentIntent.id);
        setCartError(`Your transactionId is ${paymentIntent.id}`)
        //payment info data
        const paymentInfo = {
        email: user.email,
        TransitionId : paymentIntent.id,
        price,
        quantity:cart.length,
        status: "Order pending",
        itemname: cart.map(item => item.name),
        cartItems : cart.map(item => item._id),
        menuItems : cart.map(item => item.menuItemId)
        }
        //console.log(paymentInfo);

        //send info to backend
        axiosSecure.post('/payments', paymentInfo)
        .then(res => {
            console.log(res.data);
            alert("Paymet success!");
        })

      }
    } catch (error) {
      console.error('Error confirming card payment:', error);
      setCartError('Payment failed. Please try again.');
    }
  };

  return (
    <div className='flex flex-col sm:flex-row justify-start items-start gap-8'>
      {/* Left side - Order summary */}
      <div className='md:w-1/2 w-full space-y-3'>
        <h4 className="text-lg font-semibold">Order Summary</h4>
        <p>Total Price : ${price}</p>
        <p>Number of Items : {cart.length}</p>
      </div>

      {/* Right side - Payment form */}
      <div className='md:w-1/3 w-full space-y-5 card shrink-0 max-w-sm shadow-2xl bg-white px-4 py-7'>
        <h4 className="text-lg font-semibold">Process Your Payment</h4>
        <h5 className='font-medium'>Credit/Debit Card</h5>
        
        {/* Stripe form */}
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          <button type="submit" disabled={!stripe} className='btn btn-sm btn-primary w-full mt-5 text-white'>
            Pay
          </button>
        </form>

        {/* Error handling */}
        {cartError && <p className='text-red'>{cartError}</p>}

        {/* PayPal button */}
        <div className="mt-5 text-center">
          <hr />
          <button type="submit" disabled={!stripe} className='btn btn-sm mt-5 bg-orange-500 text-white'>
            <FaPaypal /> Pay with Paypal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
