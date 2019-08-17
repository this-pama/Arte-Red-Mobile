import { GET_BANK_DETAILS } from './variables'

export const getBankDetailsAction = data => ({
	type: GET_BANK_DETAILS,
	payload: data,
})