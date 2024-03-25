import { getContactById, getContacts } from './api'
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Contact } from './Contact';

export function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [currentContactId, setCurrentContactId] = useState('');
    const [currentContact, setCurrentContact] = useState({
        id: '',
        name: '',
        email: '',
        createdAt: '',
        messages: [],
    });

    useEffect(() => {
        getContacts().then((data) => setContacts(data));
    }, []);

    useEffect(() => {
        if (currentContactId) {
            getContactById(currentContactId).then((data) => setCurrentContact(data));
        }
    }, [currentContactId]);

    const resetCurrentContact = () => {
        getContactById(currentContactId).then((data) => setCurrentContact(data));
    }

    if (contacts.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>Contacts</h1>
            <ul>
                {contacts.map((contact) => (
                    <li key={contact.id}>
                        <b>{contact.name}</b> ({contact.email})
                        <br />
                        {format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm')}
                        <br />
                        <button onClick={() => setCurrentContactId(contact.id)}>Show messages</button>
                        <br />
                    </li>
                ))}
            </ul>

            {currentContact.id && (
                <Contact currentContact={currentContact} resetCurrentContact={resetCurrentContact} />
            )}

        </>
    );
}