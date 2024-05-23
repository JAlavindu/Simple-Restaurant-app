import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext"; 
import CartItem from "./CartItem";

export default function Cart(){
    const userProgressCtx = useContext(UserProgressContext);
    const cartCtx = useContext(CartContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        totalPrice + item.quantity * item.price;
    })

    function handleCloseCart(){
        userProgressCtx.hideCart();
    }

    function handleGoToCheckouts(){
        userProgressCtx.showCheckout();
    }

    return(
        <Modal className="cart" open={userProgressCtx.progress === 'cart' } onClose={userProgressCtx.progress==='cart' ? handleCloseCart : null}>
            <h2>Your Cart</h2>
            <ul>
            {cartCtx.items.map((item) => {
                <CartItem key={item.id} name={item.name} quantity={item.quantity} price={item.price} onIncrease={() => cartCtx.addItem} onDecrease={() => cartCtx.reomveItem}/>
            })}
            </ul>
            <p className="class-total">{currencyFormatter.format(cartTotal)}</p>
            <p className="cart-actions">
                <Button textOnly onClick={handleCloseCart}>Close</Button>
                {cartCtx.items.length > 0 && <Button onClick={handleGoToCheckouts}>Go to checkouts</Button>}  
            </p>
        </Modal>
    )
}