// Importiert Express 'Router', um Routen zu definieren
import { Router } from 'express';

// Importiert die Controller-Funktionen (die wir in Phase 5 erstellen werden)
import {
    fetchAllBooks,
    fetchBookById,
    createNewBook,
    updateExistingBook,
    deleteBookById
} from '../controllers/bookController'; // Pfad wie in Aufgabe 2.1 [cite: 196]

// Erstellt eine neue Router-Instanz
const router = Router();

/**
 * Definiert die API-Endpunkte (Routen) gemäß Aufgabe 2.4[cite: 236].
 * Jede Route wird einer Controller-Funktion zugewiesen.
 */

// GET /api/books - Holt alle Bücher
router.get('/books', fetchAllBooks);

// GET /api/books/:id - Holt ein Buch anhand seiner ID
router.get('/books/:id', fetchBookById);

// POST /api/books - Erstellt ein neues Buch
router.post('/books', createNewBook);

// PUT /api/books/:id - Aktualisiert ein bestehendes Buch
router.put('/books/:id', updateExistingBook);

// DELETE /api/books/:id - Löscht ein Buch
router.delete('/books/:id', deleteBookById);

// Exportiert den Router, damit 'index.ts' ihn verwenden kann
export default router;