import axios from 'axios';

const API_KEY = '50358243-9944b3624f9c71a45bbdf1549'; // Replace with your Pixabay API key
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        page: page,
        per_page: 15, // Fetch 15 images per page as per requirements
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data; // Return the data property from the response
  } catch (error) {
    throw new Error('Failed to fetch images from Pixabay');
  }
}