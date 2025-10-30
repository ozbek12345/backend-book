// Importiert Express und die Typen für Request, Response, NextFunction
import express, { Request, Response, NextFunction } from 'express';
// Importiert unsere definierten Buch-Routen
import bookRoutes from './routes/bookRoutes';

// --- App-Initialisierung ---
const app = express();
// Definiert den Port. Nimmt den Port aus der Umgebung (für Produktion)
// oder 4000 als Standard (für Entwicklung).
const PORT = process.env.PORT || 4000;


// --- Middleware ---

// 1. JSON Body-Parser:
// Diese Middleware ist notwendig, damit unser Server JSON-Daten,
// die z.B. bei POST-Anfragen im "Body" gesendet werden, lesen kann.
app.use(express.json());


// --- API-Routen ---
// Alle Routen aus 'bookRoutes.ts' werden hier unter dem
// Präfix '/api' registriert. (z.B. /api/books, /api/books/:id)
app.use('/api', bookRoutes);


// --- Fehlerbehandlung (Error Handling) ---

// 1. 404-Handler (Nicht gefunden):
// Diese Middleware wird ausgelöst, wenn keine der obigen Routen
// (z.B. /api/books) gepasst hat.
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Ressource nicht gefunden' });
});

// 2. Globaler Error-Handler (500):
// Diese spezielle Middleware mit 4 Argumenten (err, req, res, next)
// fängt alle Fehler ab, die in unseren Controllern mit 'next(error)'
// weitergeleitet wurden.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Loggt den Fehler auf der Konsole (wichtig für Debugging)
    console.error(err.stack);

    // Sendet eine generische Fehlermeldung an den Client
    res.status(500).json({ message: 'Interner Serverfehler' });
});


// --- Server-Start ---
app.listen(PORT, () => {
    console.log(`Server läuft: http://localhost:${PORT}`);
});