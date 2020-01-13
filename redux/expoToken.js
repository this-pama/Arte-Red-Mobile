import { EXPO_TOKEN} from './variables'

export const expoTokenAction = data => ({
	type: EXPO_TOKEN,
	payload: data,
})