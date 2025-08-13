export type ServiceCategory = 'Manicure' | 'Pedicure' | 'Podologia';

export interface ServiceItem {
  id: number;
  category: ServiceCategory;
  name: string;
  description?: string;
  price: string; 
  time: number;    
  popular?: boolean;
}

export const SERVICES: ServiceItem[] = [
    // 💅 Manicure
    { id: 1, category: 'Manicure', name: 'Manicure żelowy (przedłużanie)', description: 'Metoda na formie', price: 'od 150', time: 150, popular: true },
    { id: 2, category: 'Manicure', name: 'Manicure hybrydowy', description: 'Zdobienia, ombre, baby boomer', price: 'od 100', time: 90, popular: true },
    { id: 3, category: 'Manicure', name: 'Manicure klasyczny', description: 'Bez malowania lub z odżywką', price: '70', time: 60 },
    { id: 4, category: 'Manicure', name: 'Manicure japoński', description: 'Naturalne nabłyszczenie paznokci', price: '90', time: 60 },
    { id: 5, category: 'Manicure', name: 'Manicure french', description: 'Delikatny, elegancki efekt', price: '110', time: 75 },
    { id: 6, category: 'Manicure', name: 'Uzupełnienie żelu', description: 'Korekta kształtu i długości', price: '120', time: 120 },
    { id: 7, category: 'Manicure', name: 'Manicure biologiczny', description: 'Delikatna pielęgnacja płytki', price: '80', time: 60 },
    { id: 8, category: 'Manicure', name: 'Zdjęcie hybrydy', description: 'Z opracowaniem płytki', price: '30', time: 20 },
    { id: 9, category: 'Manicure', name: 'Zdjęcie żelu', description: 'Bezpieczne usunięcie masy', price: '40', time: 30 },
    { id: 10, category: 'Manicure', name: 'Naprawa pojedynczego paznokcia', description: 'Szybka rekonstrukcja', price: '15', time: 15 },
  
    // 🦶 Pedicure
    { id: 11, category: 'Pedicure', name: 'Pedicure hybrydowy', description: 'Pełna pielęgnacja + hybryda', price: 'od 130', time: 90, popular: true },
    { id: 12, category: 'Pedicure', name: 'Pedicure klasyczny', description: 'Opracowanie paznokci i stóp', price: '100', time: 60 },
    { id: 13, category: 'Pedicure', name: 'Pedicure french', description: 'Eleganckie wykończenie', price: '140', time: 80 },
    { id: 14, category: 'Pedicure', name: 'Pedicure SPA', description: 'Peeling + maska', price: '150', time: 90 },
    { id: 15, category: 'Pedicure', name: 'Pedicure leczniczy', description: 'Zabieg przy dolegliwościach', price: '160', time: 90 },
    { id: 16, category: 'Pedicure', name: 'Zdjęcie hybrydy ze stóp', description: 'Delikatne usunięcie', price: '40', time: 25 },
    { id: 17, category: 'Pedicure', name: 'Opracowanie pięt', description: 'Usunięcie zrogowaceń', price: '50', time: 30 },
    { id: 18, category: 'Pedicure', name: 'Naprawa paznokcia u stopy', description: 'Rekonstrukcja punktowa', price: '20', time: 15 },
  
    // 🩺 Podologia
    { id: 19, category: 'Podologia', name: 'Konsultacja podologiczna', description: 'Diagnoza problemów stóp', price: '80', time: 30 },
    { id: 20, category: 'Podologia', name: 'Usunięcie odcisku', description: 'Zabezpieczenie opatrunkiem', price: '80', time: 30 },
    { id: 21, category: 'Podologia', name: 'Usunięcie modzela', description: 'Opracowanie mechaniczne', price: '90', time: 30 },
    { id: 22, category: 'Podologia', name: 'Opracowanie paznokci problematycznych', description: 'Zgrubienia, onycholiza', price: '100', time: 45 },
    { id: 23, category: 'Podologia', name: 'Rekonstrukcja paznokcia', description: 'Specjalistyczna masa', price: '70', time: 45 },
    { id: 24, category: 'Podologia', name: 'Leczenie wrastającego paznokcia (klamra)', description: 'Dobór i założenie klamry', price: '150', time: 60, popular: true },
    { id: 25, category: 'Podologia', name: 'Tamponada paznokcia', description: 'Odciążenie i ochrona', price: '30', time: 10 },
    { id: 26, category: 'Podologia', name: 'Dezynfekcja + opatrunek', description: 'Pielęgnacja pozabiegowa', price: '20', time: 10 },
  ];