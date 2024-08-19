import React from 'react';
import logo from './assets/logo.png';
import './Header.css';
import Nav from './Nav';

function Header() {
    return (
        <header className='header'>
            <div className='logo'>
                <img src={logo}  alt='Little Lemon Logo' className='logo-img'/>
            </div>
            <Nav />
        </header>

    );
}
export default Header;