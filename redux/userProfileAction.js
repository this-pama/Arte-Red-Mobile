import { GET_USER_PROFILE } from './variables'

export const getUserProfileAction = data => ({
	type: GET_USER_PROFILE,
	payload: data,
})