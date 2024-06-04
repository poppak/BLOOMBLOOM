import React, {useContext, useState} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Button, Container} from "react-bootstrap";
import '../css/style.css'
import {observer} from "mobx-react-lite";
import {useHistory} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, USER_ROUTE} from "../utils/consts";
import {BsBoxArrowRight, BsBoxArrowInRight, BsPersonFill, BsFileSpreadsheet} from 'react-icons/bs';
import Basket from "../components/modals/Basket";
import {LiaShoppingBagSolid} from "react-icons/lia";
import {RiAdminFill} from "react-icons/ri";


const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useHistory()
    const [basketVisible, setBasketVisible] = useState(false)

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        console.log(user)
    }

    return (
        <div>
            <Navbar className="bg-rose" data-bs-theme="dark" style={{height: 50}}>
                <Container>
                    <Navbar.Brand className="custom-navbar" href="shop">BLOOMBLOOM</Navbar.Brand>
                    {user.isAuth ?

                        <Nav className="ml-auto">
                            <Button onClick={() => setBasketVisible(true)} className="btn-1"><LiaShoppingBagSolid
                                style={{width: '28px', height: '28px'}} />
                                </Button>
                            <Button onClick={() => history.push(ADMIN_ROUTE)} className="btn-1"><RiAdminFill /></Button>
                            <Button onClick={() => history.push(USER_ROUTE)} className="btn-1"><BsPersonFill/></Button>
                            <Button onClick={() => logOut()} className="btn-1"><BsBoxArrowRight/></Button>
                        </Nav>
                        :
                        <Nav className="ml-auto">
                            <Button onClick={() => history.push(LOGIN_ROUTE)} className="btn-1"><BsBoxArrowInRight style={{ fontWeight: 'bold' }}/></Button>
                        </Nav>
                    }
                </Container>
            </Navbar>
            <Basket show={basketVisible} onHide={() => setBasketVisible(false)}/>
        </div>
    );
});

export default NavBar;