// Importiert 'supertest' für HTTP-Anfragen
import request from 'supertest';
// Importiert das Dateisystem (fs) und Pfad (path) Modul
import fs from 'fs';
import path from 'path';

// WICHTIG: Wir importieren den Typen von 'app' (Express) für TypeScript
import { Express } from 'express';

// Definiert den Pfad zu unserer Test-Datenbank-Datei
const bookDbPath = path.resolve(process.cwd(), 'src', 'data', 'books.json');

// Wir deklarieren 'app' hier, laden es aber erst in 'beforeEach'
// damit wir es bei jedem Test neu laden können.
let app: Express;

beforeEach(() => {
    // 1. Zuerst die 'books.json' Datei auf '[]' zurücksetzen
    fs.writeFileSync(bookDbPath, '[]', 'utf-8');

    // 2. Jest anweisen, den Modul-Cache (das "Gedächtnis") zu löschen
    jest.resetModules();
    // Der 'bookService' wird nun die (jetzt leere) 'books.json' neu einlesen.
    // Wir verwenden 'require', da 'import' nur auf Top-Level funktioniert.
    app = require('../index').default;
});

// Test-Suite (Test-Sammlung) für die Book API
describe('Book API', () => {

    // Test 1: Ein neues Buch erstellen
    it('POST /api/books - Sollte ein neues Buch erstellen (201)', async () => {
        const newBook = {
            title: "Jest ile Test",
            author: "Test Yazarı",
            isbn: "1111222233",
            publishedDate: "2025-01-01",
            available: true
        };

        // 'app' ist jetzt die "saubere" Version für diesen Test
        const response = await request(app)
            .post('/api/books')
            .send(newBook);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Jest ile Test");
        expect(response.body.id).toBeDefined();
    });

    // Test 2: Validierungsfehler prüfen
    it('POST /api/books - Sollte bei fehlendem Titel einen Fehler werfen (400)', async () => {
        const badBook = {
            author: "Test Yazarı",
            isbn: "1111222233",
            publishedDate: "2025-01-01",
            available: true
        };

        // 'app' ist jetzt die "saubere" Version für diesen Test
        const response = await request(app)
            .post('/api/books')
            .send(badBook);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Ungültige Eingabedaten');
    });

    // Test 3: Bücher aflisten (GET)
    it('GET /api/books - Sollte alle Bücher auflisten (200)', async () => {
        // Vorbereitung: (Die DB ist dank beforeEach leer)
        await request(app).post('/api/books').send({
            title: "Das erste Buch",
            author: "Autor A",
            isbn: "0000000001",
            publishedDate: "2025-01-01",
            available: true
        });

        // Jetzt die GET-Anfrage senden
        const response = await request(app).get('/api/books');

        // Erwartungen:
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1); // (Erwartet 1, weil die DB sauber war)
        expect(response.body[0].title).toBe("Das erste Buch");
    });

});