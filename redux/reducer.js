import {combineReducers} from 'redux'
import { LOGIN } from './variables'
import { GET_USER_ID, GET_USER_PROFILE, ADD_BANK_DETAIL, GET_BANK_DETAILS } from "./variables"

const merge = (prev, next) => Object.assign({}, prev, next)

// Wallet Reducer
const walletReducer = ( state={}, action) => {
  if (action.type === 'MANAGE_WALLET') {
    return merge( state, { wallet : action.payload})
  }

  return state
}

const loginReducer = (state = {}, action) => {
  if (action.type === LOGIN) return  action.payload
  return state
}

const getUserIdReducer = (state = {}, action) => {
  if (action.type === GET_USER_ID) return  action.payload
  return state
}

const getUserProfileReducer = (state = {}, action) => {
  if (action.type === GET_USER_PROFILE) return action.payload
  return state
}

const addBankReducer = (state = {}, action) => {
  if (action.type === ADD_BANK_DETAIL ) return action.payload
  return state
}

const getBankDetailsReducer = (state = {}, action) => {
  if (action.type === GET_BANK_DETAILS ) return action.payload
  return state
}



// define  combine reducer
const reducer = combineReducers({
  login: loginReducer, 
  getUserId: getUserIdReducer, 
  userProfile: getUserProfileReducer,
  bank: addBankReducer,
  bankDetails: getBankDetailsReducer
})

export default reducer
