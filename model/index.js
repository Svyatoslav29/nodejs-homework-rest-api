import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import contacts from './contacts.json';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const listContacts = async() => {
  return contacts
}

const getContactById = async(contactId) => {
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact
}

const removeContact = async(contactId) => {
    let contactToDel 
    const newContacts = contacts.reduce((storage, contact) => {
        if (contact.id === contactId) {
            contactToDel = contact
        } else {
            storage.push(contact);
        }
        return storage
    }, [])
    if (!contactToDel) {
        return null
    }
    await fs.writeFile(
        path.join(__dirname, 'contacts.json'),
        JSON.stringify(newContacts, null, 2));
    return contactToDel
}

const addContact = async (initialData) => {
      const{name, email, phone}=initialData
    if (!Object.values(initialData).every((initialData) => initialData)) {
        return 'Please fill all fields correctly'
    }
    const newContact = { id: randomUUID(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(
        path.join(__dirname, 'contacts.json'),
        JSON.stringify(contacts, null, 2));
    return newContact
}

const updateContact = async (contactId, body) => {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    const updatedContact = { id: contactId, ...contacts[index], ...body };
    contacts[index] = updatedContact;
    await fs.writeFile(
        path.join(__dirname, 'contacts.json'),
      JSON.stringify(contacts, null, 2));
    return updatedContact;
  }
  return null
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
