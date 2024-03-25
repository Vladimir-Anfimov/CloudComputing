import { format } from 'date-fns';
import { createMessage } from './api';
import { useState } from 'react';

export const Contact = ({ currentContact, resetCurrentContact }) => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleTextChange = (event) => {
        setText(event.target.value);
    }

    // {
    //     "id": 9,
    //     "text": "BUNA SERARA",
    //     "createdAt": "2024-03-24T22:51:51.477Z",
    //     "contactId": 1,
    //     "fileId": "e0371b6f-d1cf-4e4e-a4e8-d1b12b81cf79"
    // }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!text && !file) {
            alert('Please enter a message or select a file');
            return;
        }

        const response = await createMessage(currentContact.id, text, file);

        if (response.error) {
            alert(response.error);
        } else {
            console.log(response);
            setText('');
            setFile(null);
            resetCurrentContact();
        }
    }

    return (
        <>
            <h2>Messages for {currentContact.name}</h2>
            <ul>
                {currentContact.messages.map((message) => (
                    <li key={message.id}>
                        <b>{message.text}</b> {format(new Date(message.createdAt), 'yyyy-MM-dd HH:mm')}
                        <br /><br />
                        {message.file && <img src={`data:image/png;base64,${message.file.data}`} alt="file" />}

                    </li>
                ))}
            </ul>

            <h2>Send a message</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <br />
                <input type="text" value={text} onChange={handleTextChange} placeholder="Message" />
                <br />
                <button>Send message</button>
            </form>
        </>
    );
}