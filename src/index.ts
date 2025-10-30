// Importiert Express und die Typen für Request, Response, NextFunction
import express, { Request, Response, NextFunction } from 'express';
// Importiert unsere definierten Buch-Routen
import bookRoutes from './routes/bookRoutes';
import cors from 'cors';

// --- App-Initialisierung ---
const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// --- API-Routen ---
app.use('/api', bookRoutes);

// --- Fehlerbehandlung (Error Handling) ---
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Ressource nicht gefunden' });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Interner Serverfehler' });
});

// --- Server-Start für J-UNIT

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server läuft: http://localhost:${PORT}`);
    });
}

// export für app object zum Testen "supertest"
export default app;