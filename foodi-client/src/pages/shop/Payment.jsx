import React from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm';
import UseCart from '../../hooks/UseCart';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const Payment = () => {
    const [cart] = UseCart();

    //calculate checkout prices
    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

    const totalPrice = parseFloat(cartTotal.toFixed(2))
    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4  py-28     ">
            <Elements stripe={stripePromise}>
            <CheckoutForm price={totalPrice} cart={cart} />
        </Elements>
        </div>
    )
}

export default Payment
