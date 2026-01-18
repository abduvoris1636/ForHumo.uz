import Link from 'next/link';

export default function NotFound() {
    return (
        <html lang="uz">
            <head>
                <meta httpEquiv="refresh" content="3;url=/" />
            </head>
            <body className="bg-background text-foreground">
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">404 - Sahifa topilmadi</h2>
                    <p className="mb-6 text-muted-foreground">Siz qidirayotgan sahifa mavjud emas. 3 soniyadan so'ng asosiy sahifaga yo'naltirilasiz...</p>
                    <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                        Asosiy sahifaga qaytish
                    </Link>
                </div>
            </body>
        </html>
    );
}
