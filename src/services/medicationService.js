import { getDB } from './sqliteService';

export const addMedication = (data) => {
    const db = getDB();
    const result = db.runSync(
        'INSERT INTO medications (userId, name, dosage, frequency, stock, alertThreshold) VALUES (?, ?, ?, ?, ?, ?)',
        [data.userId, data.name, data.dosage, data.frequency, data.stock, data.alertThreshold]
    );
    return result.lastInsertRowId;
};

export const getMedications = (userId) => {
    const db = getDB();
    return db.getAllSync('SELECT * FROM medications WHERE userId = ?', [userId]);
};

export const recordDose = (medicationId, userId, currentStock) => {
    const db = getDB();
    if (currentStock > 0) {
        db.runSync('UPDATE medications SET stock = ? WHERE id = ?', [currentStock - 1, medicationId]);
    }
    
    const result = db.runSync(
        'INSERT INTO adherence_logs (userId, medicationId, timestamp) VALUES (?, ?, ?)', 
        [userId, medicationId, new Date().toISOString()]
    );
    return result;
};

export const getAdherenceLogs = (userId) => {
    const db = getDB();
    return db.getAllSync('SELECT * FROM adherence_logs WHERE userId = ?', [userId]);
};

export const getAdherenceLogsToday = (userId) => {
    const db = getDB();
    // Obtiene formato "YYYY-MM-DD"
    const today = new Date().toISOString().split('T')[0];
    return db.getAllSync('SELECT * FROM adherence_logs WHERE userId = ? AND timestamp LIKE ?', [userId, `${today}%`]);
};

export const updateMedicationStock = (medicationId, newStock) => {
    const db = getDB();
    const result = db.runSync('UPDATE medications SET stock = ? WHERE id = ?', [newStock, medicationId]);
    return result.changes;
};
