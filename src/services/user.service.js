export class UserService {
    constructor() {
        this.API_URL = 'http://localhost:8000';
    }

    async loadUser(name) {
        const response = await fetch(`${this.API_URL}/users/${name}/name`);
        const data = await response.json();
        return data;
    }

    async get() {
        try {
            const response = await fetch(`${this.API_URL}/users`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar a lista de usuarios:', error);
            throw error;
        }
    }

    async getContacts(id) {
        try {
            const response = await fetch(`${this.API_URL}/users/${id}/contacts`);
            const data = await response.json();
            return data.contacts;
        } catch (error) {
            console.error('Erro ao buscar a lista de contatos do usuario:', error);
            throw error;
        }
    }
    async create(name) {
        try {
            const response = await fetch(`${this.API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao adicionar um usuario:', error);
            throw error;
        }
    }

    async update(contact) {
        try {
            const response = await fetch(`${this.API_URL}/users/${contact.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao atualizar um usuario:', error);
            throw error;
        }
    }

    async delete(contactId) {
        try {
            const response = await fetch(`${this.API_URL}/users/${contactId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao remover um usuario:', error);
            throw error;
        }
    }
}
