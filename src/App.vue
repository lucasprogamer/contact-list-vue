<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  <div id="app" class="container">
    <h1 v-if="!user">Bem-vindo(a)!</h1>
    <h1 v-else>Olá, {{ user?.name }}!</h1>

    <div v-if="!user" class="start-screen">
      <input v-model="nameInput" placeholder="Insira seu nome">
      <button @click="saveUser"><i class="fas fa-save"></i> Salvar</button>
    </div>

    <div v-else class="content">
      <div class="actions">
        <button class="add-button" @click="openModal(true, null)"><i class="fas fa-plus"></i> Adicionar Contato</button>
      </div>
      <div class="contact-list">
        <ul>
          <li v-for="(contact, index) in contacts" :key="index">
            <span>{{ contact.name }}</span>
            <span>{{ formatPhone(contact.number) }}</span>
            <span>{{ contact.email }}</span>
            <span>
              <a :class="contact.has_whatsapp ? '' : 'link-disable'" target="_blank"
                :href="'http://wa.me/+55' + contact.number">whatsapp</a>
            </span>
            <div class="actions">
              <button class="edit-button" @click="openModal(false, index)"><i class="fas fa-edit"></i></button>
              <button class="delete-button" @click="removeContact(index)"><i class="fas fa-trash-alt"></i></button>
            </div>
          </li>
        </ul>

        <div class="modal" :class="{ 'modal-open': modalOpen }">
          <div class="modal-content">
            <span class="close-button" @click="closeModal">&times;</span>
            <h2>{{ editMode ? 'Editar' : 'Adicionar' }} Contato</h2>
            <form @submit.prevent="editMode ? updateContact() : addContact()">
              <div class="form-group">
                <label for="name"><i class="fas fa-user"></i></label>
                <input id="name" v-model="newContact.name" placeholder="Nome" required>
              </div>
              <div class="form-group">
                <label for="phone"><i class="fas fa-phone"></i></label>
                <input v-mask="'(##) #####-####'" id="phone" v-model="newContact.number" placeholder="Telefone" required>
              </div>
              <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i></label>
                <input id="email" v-model="newContact.email" placeholder="Email">
              </div>
              <div class="form-group">
                <label for="whatsapp"><i class="fa fa-whatsapp"></i></label>
                <input style="padding-right: 10px;" type="checkbox" id="whatsapp" name="whatsapp"
                  :checked="newContact.has_whatsapp"> <label for="whatsapp" style="margin-left: 10px;">Possui
                  whatsapp</label>
              </div>
              <button type="submit">{{ editMode ? 'Atualizar' : 'Adicionar' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ContactService } from './services/contact.service';
import { UserService } from './services/user.service';

export default {
  data() {
    return {
      user: null,
      nameInput: '',
      contacts: [],
      newContact: { name: '', number: '', email: '', has_whatsapp: 0, user_id: null },
      editMode: false,
      contactIndex: null,
      modalOpen: false
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    async addContact() {
      try {
        const contactService = new ContactService();
        const addedContact = await contactService.create({ ...this.newContact, 'user_id': this.user.id });
        this.contacts.push(addedContact);
        this.newContact = { name: '', number: '', email: '', has_whatsapp: false, user_id: null };
        this.modalOpen = false;
      } catch (error) {
        console.error('Erro ao adicionar um contato:', error);
      }
    },
    async updateContact() {
      try {
        const contactService = new ContactService();
        const updatedContact = await contactService.update(this.newContact);
        this.contacts.splice(this.contactIndex, 1, updatedContact);
        this.newContact = { name: '', number: '', email: '' };
        this.editMode = false;
        this.contactIndex = null;
        this.modalOpen = false;
      } catch (error) {
        console.error('Erro ao atualizar um contato:', error);
      }
    },
    async removeContact(index) {
      if (confirm('Deseja remover este contato?')) {
        try {
          const contactService = new ContactService();
          await contactService.delete(this.contacts[index].id);
          this.contacts.splice(index, 1);
        } catch (error) {
          console.error('Erro ao remover um contato:', error);
        }
      }
    },
    formatPhone(phone) {
      return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    openModal(addContact, index) {
      this.newContact = addContact
        ? { name: '', number: '', email: '' }
        : { ...this.contacts[index] };
      this.editMode = !addContact;
      this.contactIndex = index;
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    },
    async loadUser() {
      return new Promise((resolve, reject) => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          let userService = new UserService();
          userService.loadUser(user.name).then(async user => {
            this.user = user;
            this.contacts = await userService.getContacts(user.id);
            resolve(resolve);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
        }
      });
    },
    async saveUser() {
      await this.loadUser();
      if (!this.user) {
        let userService = new UserService();
        userService.create(this.nameInput).then(user => {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
        });
        this.nameInput = '';
      }
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f1f1f1;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

h1 {
  margin-bottom: 20px;
  color: #333;
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(50px);
  }

  to {
    transform: translateY(0);
  }
}

.start-screen {
  margin-top: 50px;
  animation: slide-up 0.5s ease-out;
}

.start-screen input {
  margin-right: 10px;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  animation: slide-left 0.5s ease-out;
}

.start-screen button {
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
  animation: slide-right 0.5s ease-out;
}

.content {
  display: flex;
  flex-direction: column;
}

.add-button {
  margin: 20px auto;
  float: right;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
  animation: slide-up 0.5s ease-out;
}

a.link-disable {
  pointer-events: none;
  color: #616161 !important;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
  animation: fade-in 0.5s ease-out;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: slide-up 0.5s ease-out;
}

li span {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li .actions {
  display: flex;
  align-items: center;
}

li .edit-button,
li .delete-button {
  margin-left: 10px;
  padding: 4px;
  font-size: 14px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

li .edit-button:hover,
li .delete-button:hover {
  color: #333;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-open {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in 0.5s ease-out;
}

.modal-content {
  background-color: #fff;
  margin: 15% auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 400px;
  position: relative;
  animation: slide-up 0.5s ease-out;
}

.close-button {
  color: #888;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  animation: fade-in 0.5s ease-out;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  animation: fade-in 0.5s ease-out;
}

label {
  margin-right: 10px;
  color: #333;
}

input[type="text"] {
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  animation: slide-left 0.5s ease-out;
}

button[type="submit"] {
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
  animation: slide-right 0.5s ease-out;
}

/* Estilo para tela pequena */
@media only screen and (max-width: 480px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 24px;
  }

  .start-screen input,
  .start-screen button,
  .add-button,
  li span {
    font-size: 14px;
  }

  .modal-content {
    margin: 10% auto;
    padding: 10px;
  }

  h2 {
    font-size: 20px;
  }

  input[type="text"],
  button[type="submit"] {
    font-size: 14px;
  }
}
</style>
