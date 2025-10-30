// Notwendige Importe
import { Book } from '../models/book'; // Unser "Book"-Modell (Interface) [cite: 211]
import { v4 as uuidv4 } from 'uuid';   // Zum Erstellen von einzigartigen IDs [cite: 189, 214]

/**
 * Unsere In-Memory-Datenbank.
 * Wir starten mit einem leeren Array [].
 * Laut Aufgabe (002) speichern wir die Daten "in Memory".
 */
let books: Book[] = [];

/**
 * HINWEIS (Optionale Aufgabe):
 * An dieser Stelle könnten wir 'fs.readFileSync' verwenden,
 * um die optionale Datei 'src/data/books.json' zu laden[cite: 204, 233].
 */

// === SERVICE-FUNKTIONEN ===

/**
 * Funktion 1: Alle Bücher abrufen
 * (Entspricht 'fetchAllBooks')
 */
export const getAllBooks = (): Book[] => {
    // Gibt einfach das komplette Array zurück
    return books;
};

/**
 * Funktion 2: Ein einzelnes Buch über die ID abrufen
 * (Entspricht 'fetchBookById')
 */
export const getBookById = (id: string): Book | undefined => {
    // Sucht das Buch im Array anhand der ID.
    // Gibt 'undefined' zurück, wenn nichts gefunden wird.
    return books.find(book => book.id === id);
};

/**
 * Funktion 3: Ein neues Buch erstellen
 * (Entspricht 'createNewBook')
 *
 * Nimmt die Eingabedaten (title, author, isbn...) entgegen.
 *
 * Omit<...> ist ein TypeScript-Hilfsmittel und bedeutet:
 * Nimm alle Felder von 'Book', außer 'id', 'createdAt' und 'updatedAt'.
 * Diese werden hier automatisch generiert[cite: 229].
 */
export const createBook = (input: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book => {

    // Ein neues Buch-Objekt erstellen, basierend auf dem Interface
    const newBook: Book = {
        id: uuidv4(), // Automatische ID-Zuweisung [cite: 214, 229]
        title: input.title,
        author: input.author,
        isbn: input.isbn,
        publishedDate: input.publishedDate,
        available: input.available,
        createdAt: new Date(), // Automatisches Erstellungsdatum [cite: 224, 229]
        updatedAt: new Date(), // Automatisches Update-Datum [cite: 226, 229]
    };

    // Das newBook zum In-Memory-Array 'books' hinzufügen
    books.push(newBook);

    /**
     * HINWEIS (Optionale Aufgabe):
     * Nach 'books.push(newBook)' müssten wir hier die optionale
     * JSON-Datei synchron speichern (fs.writeFileSync)[cite: 234].
     */

    // Das komplett neue Buch zurückgeben (wichtig für die "201 Created"-Antwort)
    return newBook;
};

/**
 * Funktion 4: Ein bestehendes Buch aktualisieren
 * (Entspricht 'updateExistingBook')
 */
export const updateBook = (
    id: string,
    updates: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>> // Partial<> erlaubt Teil-Updates
): Book | undefined => {

    // Findet den Index (die Position) des Buches im Array
    const bookIndex = books.findIndex(book => book.id === id);

    // Buch nicht gefunden
    if (bookIndex === -1) {
        return undefined; // Controller wird hieraus 404 Not Found machen
    }

    // Das alte Buch holen
    const originalBook = books[bookIndex];

    // Das neue, aktualisierte Buch-Objekt erstellen
    const updatedBook: Book = {
        ...originalBook,         // Behält die alte 'id' und 'createdAt' bei
        ...updates,              // Wendet die neuen Daten aus 'updates' an
        updatedAt: new Date(),   // Setzt das 'updatedAt'-Datum auf jetzt [cite: 226]
    };

    // Das alte Buch im Array durch das neue ersetzen
    books[bookIndex] = updatedBook;

    /**
     * HINWEIS (Optionale Aufgabe):
     * Hier müsste auch 'fs.writeFileSync' aufgerufen werden[cite: 234].
     */

    return updatedBook;
};

/**
 * Funktion 5: Ein Buch löschen
 * (Entspricht 'deleteBookById')
 */
export const deleteBook = (id: string): boolean => {
    // Findet den Index des Buches
    const bookIndex = books.findIndex(book => book.id === id);

    // Buch nicht gefunden, 'false' zurückgeben
    if (bookIndex === -1) {
        return false; // Controller macht 404
    }

    // Das Buch aus dem Array entfernen (splice)
    books.splice(bookIndex, 1);

    /**
     * HINWEIS (Optionale Aufgabe):
     * Hier müsste auch 'fs.writeFileSync' aufgerufen werden[cite: 234].
     */

    // Erfolgreich gelöscht, 'true' zurückgeben (Controller macht 204 No Content)
    return true;
};