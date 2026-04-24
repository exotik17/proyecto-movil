import * as SQLite from 'expo-sqlite';

const dbName = 'medrutina.db';
let db = null;

export const initDB = () => {
    try {
        if (!db) {
            db = SQLite.openDatabaseSync(dbName);
        }
        db.execSync(`
            CREATE TABLE IF NOT EXISTS medications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT,
                name TEXT NOT NULL,
                dosage TEXT,
                frequency TEXT,
                stock INTEGER DEFAULT 0,
                alertThreshold INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS adherence_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT,
                medicationId INTEGER,
                timestamp TEXT,
                FOREIGN KEY(medicationId) REFERENCES medications(id)
            );
            CREATE TABLE IF NOT EXISTS medical_contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT,
                name TEXT NOT NULL,
                specialty TEXT,
                phone TEXT
            );
        `);
        console.log("Base de datos SQLite inicializada correctamente");
    } catch (error) {
        console.error("Error al inicializar la base de datos", error);
    }
};

export const getDB = () => {
    if (!db) {
        db = SQLite.openDatabaseSync(dbName);
    }
    return db;
};