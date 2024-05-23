import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Input from "./Input";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgressContext"; 
import useHttp from "../hooks/useHttp";

const requestConfig ={
    method: 'POST',
    headers: {
        'Content-type': 'application/jason'
    }

}

export default function Checkout(){
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const {data, isLoading: isSending, error, sendRequest, clearData} = useHttp(
        'http://localhost:3000/orders',
        requestConfig
    )

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        totalPrice + item.quantity * item.price;
    })

    function handleClose(){
        userProgressCtx.hideCheckout();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart()
        clearData()
    }

    function handleSubmit(event){
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(JSON.stringify({
            order:{
                items: cartCtx.items,
                customer: customerData
            }}))

        fetch('http://localhost:3001/orders',{
            methode:'POST', 
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order:{
                    items: cartCtx.items,
                    customer: customerData
                }})})
    }

    let actions = (
        <>
        <Button type="button" textOnly onClick={handleClose}>Close</Button>
        <Button>Submit Order</Button>
        </>
        
    )

    if(isSending){
        actions = <span>sending order data...</span>
    }

    if(data && !error){
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>success</h2>
            < p className="modal-actions">
                <Button onClick={handleFinish}>okay</Button>
            </p>
        </Modal>
    }

    return(
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total amount:{currencyFormatter.format(cartTotal)}</p>
                <Input label="full name" type="text" id="name"/>
                <Input label="E-Mail Address" type="text" id="email"/>  
                <Input label="Street" type="text" id="street"/> 
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code"/>
                    <Input label="City" type="text" id="city"/>
                </div>

                {error && <Error title="failed to submit" message={error}/>}
                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    )
}