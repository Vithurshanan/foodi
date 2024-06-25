import React, { useContext, useEffect, useState } from 'react';
import UseCart from '../../hooks/UseCart';
import { FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/AuthProvider';

const CartsPage = () => {
    const [cart, refetch] = UseCart();
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        setCartItems(cart);
    }, [cart]);


    //calculate price
    const calculatePrice = (item) => {
        return item.price * item.quantity;
    }


    // handle increase
    const handleIncrease = async (item) => {
        try {
            const res = await fetch(`http://localhost:8080/carts/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ quantity: item.quantity + 1 })
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

            const updatedCart = cartItems.map((cartItem) => {
                if (cartItem._id === item._id) {
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity + 1
                    };
                }
                return cartItem;
            });

            setCartItems(updatedCart);
            refetch(); // Refresh cart data

        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    // handle decrease
    const handleDecrease = async (item) => {
        if (item.quantity > 1) {
            try {
                const res = await fetch(`http://localhost:8080/carts/${item._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({ quantity: item.quantity - 1 })
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await res.json();

                const updatedCart = cartItems.map((cartItem) => {
                    if (cartItem._id === item._id) {
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity - 1
                        };
                    }
                    return cartItem;
                });

                setCartItems(updatedCart);
                refetch(); // Refresh cart data

            } catch (error) {
                console.error('Error updating item quantity:', error);
            }
        }
        else{
            alert("Item can't be zero")
        }
    };

    //calculate total price
    const cartSubTotal = cart.reduce((total , item) => {
        return total + calculatePrice(item);
    },0);

    const orderTotal = cartSubTotal;



    //handle delet button
    const handleDelete = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8080/carts/${item._id}`, {
                    method: "DELETE"
                })
                    .then(res => {
                        if (res.ok) {
                            return res.json();
                        }
                        throw new Error("Network response was not ok.");
                    })
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        } else {
                            throw new Error("Item could not be deleted.");
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting item:", error);
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred while deleting the item.",
                            icon: "error"
                        });
                    });
            }
        });
    };

    return (
        <div className="section-container">
            {/**banner */}
            <div className='section-container bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%'>
                <div className="py-36 flex flex-col  justify-center items-center gap-8">
                    <div className=" px-4 space-y-7">
                        <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
                            Items Added to the <span className="text-green">Cart</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/** table for the cart*/}
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead className='bg-green text-white rounded'>
                        <tr>
                            <th>#</th>
                            <th>Food</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {cart.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        s
                                    </div>
                                </td>
                                <td>{item.name}</td>
                                <td className="flex items-center gap-2">
                                    <button className='btn bg-white border-none btn-xs hover:bg-base-300 hover:text-white' onClick={() => handleDecrease(item)}>-</button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={() => console.log(item.quantity)}
                                        className='bg-white border-none w-10 mx-2 text-center overflow-hidden appearance-none'
                                    />
                                    <button className='btn bg-white border-none px-2 btn-xs hover:bg-base-300 hover:text-white' onClick={() => handleIncrease(item)}>+</button>
                                </td>
                                <td>${calculatePrice(item).toFixed(2)}</td>
                                <th>
                                    <button className="btn text-red btn-ghost btn-xs" onClick={() => handleDelete(item)}><FaTrash /></button>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/** customer details*/}
            <div className="my-12 flex flex-col md:flex-row">
                <div className="md:w-1/2 space-y-3">
                    <h3 className='font-medium'>Customer Details</h3>
                    <p>Name: {user.displayName}</p>
                    <p>E-mail: {user.email}</p>
                    <p>User_id: {user.uid}</p>
                </div>
                <br /><br />
                <div className="md:w-1/2 space-y-3">
                    <h3 className='font-medium'>Shopping Details</h3>
                    <p>Total Items: {cart.length}</p>
                    <p>Total price: ${orderTotal.toFixed(2)}</p>
                    <button className='btn bg-green text-white'>Procceed Checkout</button>
                </div>
            </div>

        </div>
    )
}

export default CartsPage
