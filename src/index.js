import {Subject} from 'rxjs'

import {startWith,scan,shareReplay} from 'rxjs/operators'
const pre=document.querySelector('pre')
const handlers={
    INCREMENT:state=>({...state,counter:state.counter+1}),
    DECREMENT:state=>({...state,counter:state.counter-1}),
    ADD:state,action=>({...state,counter:state.counter+action.payload}),
    DEFAULT:state,action=>({...state,counter:state.counter+action.payload})
}

const initialState={
    counter:0
}
function reducer(state=initialState,action){
    // switch(action.type){
    //     case 'INCREMENT': return {...state,counter:state.counter+1}
    //     case 'DECREMENT': return {...state,counter:state.counter-1}
    //     case 'ADD': return {...state,counter:state.counter+action.payload}
    //     default: return state
    // }
    const handler=handlers[action.type] || handlers.DEFAULT
    return handler(state,action)
}
function createStore(rootReducer){
    const subj$=new Subject()
    const store$=subj$.pipe(
        startWith({type:'__INIT__}),
        scan(rootReducer,undefined),
        shareReplay(1)
    )
    store$.dispatch=action=>subj$.next(action)
    return store$ 
}
const store=createStore(reducer)
store$.subscribe(state=>{
    pre.innerHTML=JSON.stringify(state,null,2)
})
document.getElementById('increment').addEventListener('click',()=>{
    store$.dispatch({type:'INCREMENT'})
})
document.getElementById('decrement').addEventListener('click',()=>{
    store$.dispatch({type:'DECREMENT'})
})
document.getElementById('add').addEventListener('click',()=>{
    store$.dispatch({type:'ADD',payload:10})
})