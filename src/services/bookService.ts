// Notwendige Importe
import { Book } from '../models/book'; // Unser "Book"-Modell
import { v4 as uuidv4 } from 'uuid';   // Zum Erstellen von einzigartigen IDs
import fs from 'fs'; // Node.js File System Modul
import path from 'path'; // Node.js Pfad-Modul

const bookDbPath = path.resolve(process.cwd(), 'src', 'data', 'books.json');

// === HILFSFUNKTIONEN für JSON ===
const loadBooks = (): Book[] => {
    try {
        // Versucht, die Datei zu lesen
        const data = fs.readFileSync(bookDbPath, 'utf-8');
        // Wandelt den Text (String) in ein JSON-Objekt (Book-Array) um
        return JSON.parse(data);
    } catch (error: any) {
        // Wenn die Datei nicht existiert (z.B. erster Start),
        // wird ein leeres Array zurückgegeben.
        if (error.code === 'ENOENT') {
            console.log('Hinweis: src/data/books.json nicht gefunden. Starte mit leerem Array.');
            return [];
        }
        // Bei anderen Fehlern (z.B. JSON-Format ungültig)
        console.error('Fehler beim Laden der books.json:', error);
        process.exit(1); // Beendet den Server bei einem kritischen Ladefehler
    }
};
const saveBooks = () => {
    try {
        // Wandelt das 'books'-Array zurück in einen formatierten String
        // (null, 2 sorgt für "schöne" Formatierung mit Einzügen)
        const data = JSON.stringify(books, null, 2);
        // Schreibt die Daten synchron in die Datei
        fs.writeFileSync(bookDbPath, data, 'utf-8');
    } catch (error) {
        console.error('Fehler beim Speichern der books.json:', error);
    }
};

// ===============================================

let books: Book[] = loadBooks();


// === SERVICE-FUNKTIONEN===

/**
 * Funktion 1: Alle Bücher abrufen
 */
export const getAllBooks = (): Book[] => {
    return books;
};

/**
 * Funktion 2: Ein einzelnes Buch über die ID abrufen
 */
export const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
};

/**
 * Funktion 3: Ein neues Buch erstellen
 */
export const createBook = (input: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book => {

    const newBook: Book = {
        id: uuidv4(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    books.push(newBook);

    saveBooks();

    return newBook;
};

/**
 * Funktion 4: Ein bestehendes Buch aktualisieren
 */
export const updateBook = (
    id: string,
    updates: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>
): Book | undefined => {

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return undefined;
    }

    const originalBook = books[bookIndex];

    const updatedBook: Book = {
        ...originalBook,
        ...updates,
        updatedAt: new Date(),
    };

    books[bookIndex] = updatedBook;

    // Nach der Änderung in die Datei speichern
    saveBooks();

    return updatedBook;
};

/**
 * Funktion 5: Ein Buch löschen
 */
export const deleteBook = (id: string): boolean => {
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return false;
    }

    books.splice(bookIndex, 1);

    //Nach der Änderung in die Datei speichern
    saveBooks();

    return true;
};