// Das "Book"-Interface, wie in der Aufgabenstellung (002-Bibliothek)
// unter 2.2 definiert.
export interface Book {
    id: string; // Wird automatisch als UUID v4 generiert
    title: string; // Titel (muss mind. 3 Zeichen lang sein)
    author: string; // Autor (muss mind. 3 Zeichen lang sein)
    isbn: string; // ISBN (muss 10-13 Ziffern haben)
    publishedDate: string; // ISO-Format (YYYY-MM-DD)
    available: boolean; // Verfügbar (true) oder nicht (false)
    createdAt: Date; // Wird automatisch mit 'new Date()' erstellt
    updatedAt: Date; // Wird automatisch bei Erstellung/Update gesetzt
}