import React, {useContext} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Button, Container} from "react-bootstrap";
import '../css/style.css'
import {observer} from "mobx-react-lite";
import {useHistory} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {BsBoxArrowRight, BsBoxArrowInRight, BsPersonFill, BsFileSpreadsheet} from 'react-icons/bs';


const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useHistory()

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
                            <Button onClick={() => history.push(ADMIN_ROUTE)} className="btn-1"><BsFileSpreadsheet
                                style={{fontWeight: 'bold'}}/></Button>
                            <Button onClick={() => history.push(SHOP_ROUTE)} className="btn-1"><BsPersonFill
                                style={{fontWeight: 'bold'}}/></Button>
                            <Button onClick={() => logOut()} className="btn-1"><BsBoxArrowRight
                                style={{fontWeight: 'bold'}}/></Button>
                        </Nav>
                        :
                        <Nav className="ml-auto">
                            <Button onClick={() => history.push(LOGIN_ROUTE)} className="btn-1"><BsBoxArrowInRight style={{ fontWeight: 'bold' }}/></Button>
                        </Nav>
                    }
                </Container>
            </Navbar>
        </div>
    );
});

export default NavBar;