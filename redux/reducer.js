import {combineReducers} from 'redux'
import { LOGIN } from './variables'
import { GET_USER_ID, GET_USER_PROFILE, ADD_BANK_DETAIL, GET_BANK_DETAILS,
  MORE_ARTWORK_DETAILS, BUY_ARTWORK, RAVE_ACTION } from "./variables"

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


const moreArtworkDetailsReducer= ( state = {}, action ) => {
  if (action.type === MORE_ARTWORK_DETAILS ) return action.payload
  return state
}

const buyArtworkReducer =( state= {}, action ) => {
  if (action.type === BUY_ARTWORK ) return action.payload
  return state
}

const raveReducer =( state= {}, action ) => {
  if (action.type === RAVE_ACTION ) return action.payload
  return state
}


// define  combine reducer
const reducer = combineReducers({
  login: loginReducer, 
  getUserId: getUserIdReducer, 
  userProfile: getUserProfileReducer,
  bank: addBankReducer,
  bankDetails: getBankDetailsReducer,
  artworkDetails : moreArtworkDetailsReducer,
  buyArtwork: buyArtworkReducer,
  rave: raveReducer,
})

export default reducer
