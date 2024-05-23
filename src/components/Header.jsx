import { useContext } from 'react';
import logoImg from '../assets/logo.png';
import Button from './UI/Button';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgressContext';

export default function Header(){
    const userProgressCtx = useContext(UserProgressContext);
    const cartCtx = useContext(CartContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    },0)

    function handleShowCart(){
        userProgressCtx.showCart();
    }

    return(
        <header id="main-header">
            <div id="title">
                <img src={logoImg}/>
                <h1>Foodies</h1>
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart}>cart ({totalCartItems})</Button>
            </nav>
        </header>
    )
}