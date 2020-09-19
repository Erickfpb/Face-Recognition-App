import React from 'react';
import './Navigation.css'

const Navigation = ({onRouteChange, isSignnedIn}) => {
    
        if(isSignnedIn){
        return(
            <nav style={{display: 'flex', justifyContent:'flex-end'}}>
                <p onClick={() => onRouteChange('signout')}
                className='f4 link dim underline pa1 pointer'>Sign Out</p>
            </nav>
        );
        } else {
        return(
            <nav style={{display: 'flex', justifyContent:'flex-end'}}>
                <p onClick={() => onRouteChange('signin')}
                    className='f3 link dim underline pa3 pointer'>Sign in</p>
                <p onClick={() => onRouteChange('register')}
                    className='f3 link dim underline pa3 pointer'>Register</p>
            </nav>
        );
    }
}

export default Navigation;