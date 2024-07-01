import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FaPaypal } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ price, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [cartError, setCartError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (typeof price === 'number' && price >= 1) {
      axiosSecure.post('/create-payment-intent', { price })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(error => {
          console.error('Error fetching client secret:', error);
          setCartError('Error fetching client secret.');
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
      setCartError('Card element not found.');
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
        console.log(paymentIntent.id);
        if (paymentIntent && paymentIntent.status === "succeeded") {
          setCartError(`Your transactionId is ${paymentIntent.id}`);
          const paymentInfo = {
            email: user.email,
            transitionId: paymentIntent.id,
            price,
            quantity: cart.length,
            status: "Order pending",
            itemName: cart.map(item => item.name),
            cartItems: cart.map(item => item._id),
            menuItems: cart.map(item => item.menuItemId)
          };
          console.log(paymentInfo);
          axiosSecure.post('/payments', paymentInfo)
            .then(res => {

              alert("Payment success!");
              console.log(res.data);
              navigate('/order');
            })
            .catch(error => {
              console.error('Error sending payment info to backend:', error);
              setCartError('Payment success, but failed to update backend.');
            });
        }
      }
    } catch (error) {
      console.error('Error confirming card payment:', error);
      setCartError('Payment failed. Please try again.');
    }
  };

  return (
    <div className='flex flex-col sm:flex-row justify-start items-start gap-8'>
      <div className='md:w-1/2 w-full space-y-3'>
        <h4 className="text-lg font-semibold">Order Summary</h4>
        <p>Total Price : ${price}</p>
        <p>Number of Items : {cart.length}</p>
      </div>

      <div className='md:w-1/3 w-full space-y-5 card shrink-0 max-w-sm shadow-2xl bg-white px-4 py-7'>
        <h4 className="text-lg font-semibold">Process Your Payment</h4>
        <h5 className='font-medium'>Credit/Debit Card</h5>

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

        {cartError && <p className='text-red'>{cartError}</p>}

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
