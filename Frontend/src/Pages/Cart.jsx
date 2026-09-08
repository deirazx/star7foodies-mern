import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
const Cart = () => {
    const [items, setItems] = useState([]);
    const cartItems = useSelector(state => state.cart.items);
    useEffect(() => {
        setItems(...items, cartItems)
    }, [])

    return (
        <>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12'>
                <h1 className='text-4xl text flex items-center gap-3'>Your <h1 className='text-4xl text-orange-400'>Selection</h1></h1>
                <div>
                    {
                        items.map((i) => {
                            return <div className='flex items-center'>
                                <img src={i.imageUrl} className='w-[300px] h-[300px]' alt="" />
                                <i>
                                    {i.name}
                                </i>
                            </div>
                        })
                    }
                </div>

                <div>

                </div>
            </div>
        </>
    )
}

export default Cart