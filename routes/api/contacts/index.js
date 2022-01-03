import { Router } from 'express';
import { getContacts, getContactById, addContact, removeContact, updateContact } from '../../../controllers/contacts';
import { validateCreation, validateUpdate, validateId, validateUpdateFavorite, validateQuery } from './validation';

const router = new Router();

router.get('/', validateQuery, getContacts);

router.get('/:id', validateId, getContactById);

router.post('/', validateCreation, addContact);

router.delete('/:id', removeContact);

router.put('/:id', validateId, validateUpdate, updateContact);

router.patch('/:id/favorite', validateId, validateUpdateFavorite, updateContact);

export default router
