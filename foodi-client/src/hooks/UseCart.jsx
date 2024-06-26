import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const UseCart = () => {
    const { user } = useContext(AuthContext);
    const { refetch, data: cart = [] } = useQuery({
        queryKey: ['carts', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await fetch(`http://localhost:8080/carts?email=${user.email}`);
            return res.json();
        },
        enabled: !!user?.email, // Only run query if user email is available
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });

    return [cart, refetch];
};

export default UseCart;
