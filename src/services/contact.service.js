export class ContactService {
    constructor() {
        this.API_URL = 'http://localhost:8000';
    }

    async get() {
        try {
            const response = await fetch(`${this.API_URL}/contacts`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar a lista de contatos:', error);
            throw error;
        }
    }

    async create(contact) {
        try {
            const response = await fetch(`${this.API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao adicionar um contato:', error);
            throw error;
        }
    }

    async update(contact) {
        try {
            const response = await fetch(`${this.API_URL}/contacts/${contact.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contact),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao atualizar um contato:', error);
            throw error;
        }
    }

    async delete(contactId) {
        try {
            const response = await fetch(`${this.API_URL}/contacts/${contactId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao remover um contato:', error);
            throw error;
        }
    }
}
