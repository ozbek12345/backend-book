// Importiert Typen von Express (Request, Response, NextFunction)
import { Request, Response, NextFunction } from 'express';
// Importiert unser Book-Modell
import { Book } from '../models/book';
// Importiert ALLE Funktionen aus unserem Service
import * as bookService from '../services/bookService';

/**
 * Validierungs-Hilfsfunktion (Helferlein)
 * Diese Funktion prüft die Eingabedaten für POST / PUT Anfragen.
 * Wie in Aufgabe 3 (Validierung) gefordert.
 */
const validateBookData = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.title || data.title.length < 3) {
        errors.push('Titel ist erforderlich und muss mindestens 3 Zeichen lang sein.');
    }
    if (!data.author || data.author.length < 3) {
        errors.push('Autor ist erforderlich und muss mindestens 3 Zeichen lang sein.');
    }
    if (!data.isbn || !/^\d{10,13}$/.test(data.isbn)) {
        errors.push('ISBN ist erforderlich und muss 10-13 Ziffern lang sein.');
    }
    if (!data.publishedDate || isNaN(Date.parse(data.publishedDate))) {
        errors.push('publishedDate ist erforderlich und muss ein gültiges ISO-Datum sein (YYYY-MM-DD).');
    }
    if (typeof data.available !== 'boolean') {
        errors.push('Verfügbarkeit (available) muss ein Boolean (true/false) sein.');
    }

    return errors;
};


// === CONTROLLER-FUNKTIONEN ===

/**
 * Controller 1: Holt alle Bücher
 * Route: GET /api/books
 */
export const fetchAllBooks = (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = bookService.getAllBooks();
        // 200 OK (Standard) + JSON-Array
        res.json(books);
    } catch (error) {
        next(error); // Leitet an den globalen Error-Handler (Phase 6)
    }
};

/**
 * Controller 2: Holt ein Buch anhand der ID
 * Route: GET /api/books/:id
 */
export const fetchBookById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // Holt die :id aus der URL
        const book = bookService.getBookById(id);

        if (book) {
            // 200 OK + einzelnes JSON-Objekt
            res.json(book);
        } else {
            // 404 Not Found (Ressource nicht gefunden)
            res.status(404).json({ message: 'Buch nicht gefunden' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Controller 3: Erstellt ein neues Buch
 * Route: POST /api/books
 */
export const createNewBook = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Validierung (Aufgabe 3)
        const errors = validateBookData(req.body);
        if (errors.length > 0) {
            // 400 Bad Request (Ungültige Eingabedaten)
            return res.status(400).json({
                message: 'Ungültige Eingabedaten',
                errors: errors
            });
        }

        // 2. Service aufrufen
        const { title, author, isbn, publishedDate, available } = req.body;
        const newBook = bookService.createBook({
            title,
            author,
            isbn,
            publishedDate,
            available
        });

        // 3. Erfolg melden
        // 201 Created + das neue Objekt zurückgeben
        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller 4: Aktualisiert ein Buch
 * Route: PUT /api/books/:id
 */
export const updateExistingBook = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // 1. Validierung (Aufgabe 3)
        // Wir validieren auch hier, um sicherzustellen, dass die Updates gültig sind
        const errors = validateBookData(req.body);
        if (errors.length > 0) {
            // 400 Bad Request
            return res.status(400).json({
                message: 'Ungültige Eingabedaten',
                errors: errors
            });
        }

        // 2. Service aufrufen
        const { title, author, isbn, publishedDate, available } = req.body;
        const updatedBook = bookService.updateBook(id, {
            title,
            author,
            isbn,
            publishedDate,
            available
        });

        // 3. Ergebnis prüfen
        if (updatedBook) {
            // 200 OK + das aktualisierte Objekt zurückgeben
            res.json(updatedBook);
        } else {
            // 404 Not Found (Buch mit dieser ID existiert nicht)
            res.status(404).json({ message: 'Buch nicht gefunden' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Controller 5: Löscht ein Buch
 * Route: DELETE /api/books/:id
 */
export const deleteBookById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const success = bookService.deleteBook(id);

        if (success) {
            // 204 No Content (Erfolgreich gelöscht, kein Inhalt zurückgesendet)
            res.status(204).send();
        } else {
            // 404 Not Found (Buch mit dieser ID existiert nicht)
            res.status(404).json({ message: 'Buch nicht gefunden' });
        }
    } catch (error) {
        next(error);
    }
};