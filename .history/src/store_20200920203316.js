import {createStore} from 'redux';

export default createStore(function(state, action){
    if(state === undefined){
        return {
            number:0, 
            value:0, 
            data:[]
        }
    }
    if(action.type === 'INCREMENT'){
        return {...state, number:state.number + action.size}
    }

    if(action.type === 'TOPIC'){

        console.log("state.data.length : " + state.data.length);

        if(cnt<this.state.max_arr_cnt){
        
            return {
                ...state, 
                value:state.value + action.value, 
                data:[...state.data, action.data]
            }

        } else {

            return {
                ...state, 
                value:state.value + action.value, 
                data:[...state.data, action.data]
            }

        }        
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
