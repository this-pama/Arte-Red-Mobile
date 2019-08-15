import { GET_USER_ID } from './variables'

export const getUserIdAction = data => ({
	type: GET_USER_ID,
	payload: data,
})