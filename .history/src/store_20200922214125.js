import {createStore} from 'redux';

export default createStore(function(state, action){
    if(state === undefined){
        return {
            number:null, 
            value:null, 
            data:[]
        }
    }
    if(action.type === 'INCREMENT'){
        return {...state, number:state.number + action.size}
    }

    if(action.type === 'TOPIC'){

        console.log("state.data.length : " + state.data.length);

        if(30>state.data.length){
        
            console.log("10>state.data.length");

            return {
                ...state, 
                data:[...state.data, action.data],
                value:state.value + action.value

            }

        } else {

            console.log("else");

            return {
                ...state, 
                data:[...state.data, action.data].slice(1,31),
                value:state.value + action.value

            }

        }        
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
