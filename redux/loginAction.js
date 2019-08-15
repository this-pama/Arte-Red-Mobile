import { LOGIN } from './variables'

export const loginAction = data => ({
	type: LOGIN,
	payload: data,
})