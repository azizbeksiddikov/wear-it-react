// Use proxy in development to avoid CORS issues, production URL otherwise
// Remove trailing slash if present to avoid double slashes in URLs
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
export const serverApi: string = import.meta.env.DEV ? '/api' : apiUrl;

export const Messages = {
	error1: 'Something went wrong',
	error2: 'Please, login first',
	error3: 'Please, fill in all the fields',
	error4: 'Message is empty',
	error5: 'Only images with jpeg, jpg, png formats are allowed',
};
