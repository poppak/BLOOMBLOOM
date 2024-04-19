import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import PreorderProductStore from "./store/PreorderProductStore";

export const Context = createContext(null)
console.log(process.env.REACT_APP_API_URL)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        product: new PreorderProductStore()
    }}>
        <App />
    </Context.Provider>,
    document.getElementById('root')
);


