import {createStore} from 'redux';

export default createStore(function(state, action){
    if(state === undefined){
        return {
            number:0, 
            value:0, 
            data:{
                CreatedTime: null,
                Value:null
            }
        }
    }
    if(action.type === 'INCREMENT'){
        return {...state, number:state.number + action.size}
    }

    if(action.type === 'TOPIC'){
        return {
            ...state, 
            value:state.value + action.value, 
            data:{...state.data, Date(action.CreatedTime), Number(action.value)}
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
