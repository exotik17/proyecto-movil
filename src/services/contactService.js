import { getDB } from './sqliteService';

export const getContacts = (userId) => {
    const db = getDB();
    return db.getAllSync('SELECT * FROM medical_contacts WHERE userId = ?', [userId]);
};

export const addContact = (data) => {
    const db = getDB();
    const result = db.runSync(
        'INSERT INTO medical_contacts (userId, name, specialty, phone) VALUES (?, ?, ?, ?)',
        [data.userId, data.name, data.specialty, data.phone]
    );
    return result.lastInsertRowId;
};
