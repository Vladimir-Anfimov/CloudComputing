const API_URL = 'http://localhost:8080/api';

export const getContacts = async () => {
    const response = await fetch(`${API_URL}/contacts`);
    return response.json();
};


export const getContactById = async (id) => {
    const response = await fetch(`${API_URL}/contacts/${id}`);
    return response.json();
}


export const createContact = async (name, email) => {
    const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    });
    return response.json();
}


export const getMessages = async (userId) => {
    const response = await fetch(`${API_URL}/contacts/${userId}/messages`);
    return response.json();
}


export const createMessage = async (userId, text, file) => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('file', file);

    const response = await fetch(`${API_URL}/contacts/${userId}/messages`, {
        method: 'POST',
        body: formData,
    });
    return response.json();
}