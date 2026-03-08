# Konfiguracja Formspree dla formularza wydarzeń

## Czym jest Formspree?

Formspree to darmowa usługa, która pozwala na obsługę formularzy HTML bez potrzeby tworzenia własnego backendu. Formularze są wysyłane na Twój adres e-mail.

## Krok po kroku - Konfiguracja

### 1. Załóż konto na Formspree

1. Wejdź na stronę: https://formspree.io/
2. Kliknij "Get Started" lub "Sign Up"
3. Zarejestruj się używając adresu e-mail: `michal@ksnadolice.ovh`
4. Potwierdź adres e-mail (sprawdź skrzynkę pocztową)

### 2. Utwórz nowy formularz

1. Po zalogowaniu kliknij "+ New Form"
2. Nazwa formularza: `Wydarzenia Nadolice Wielkie`
3. Kliknij "Create Form"

### 3. Skopiuj Form ID

Po utworzeniu formularza zobaczysz kod podobny do:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Ważne:** Skopiuj wartość `YOUR_FORM_ID` (np. `xyzabc123`)

### 4. Zaktualizuj plik zglos-wydarzenie.astro

1. Otwórz plik: `src/pages/zglos-wydarzenie.astro`
2. Znajdź linię 43:
   ```html
   <form id="eventForm" class="event-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Zamień `YOUR_FORM_ID` na skopiowane ID, np.:
   ```html
   <form id="eventForm" class="event-form" action="https://formspree.io/f/xyzabc123" method="POST">
   ```
4. Zapisz plik

### 5. Wdróż zmiany

```bash
git add src/pages/zglos-wydarzenie.astro
git commit -m "Konfiguracja Formspree dla formularza wydarzeń"
git push
```

### 6. Przetestuj formularz

1. Wejdź na stronę: `https://nadolicewielkie.org/zglos-wydarzenie`
2. Wypełnij formularz testowymi danymi
3. Kliknij "Wyślij zgłoszenie"
4. Sprawdź skrzynkę e-mail `michal@ksnadolice.ovh`

**Uwaga:** Pierwsze zgłoszenie wymaga potwierdzenia w Formspree (otrzymasz e-mail z linkiem do potwierdzenia).

## Plan darmowy Formspree

- **50 zgłoszeń miesięcznie** - wystarczające dla większości lokalnych stron
- Brak reklam w e-mailach
- Podstawowa ochrona przed spamem
- Możliwość dodania wielu formularzy

## Alternatywne rozwiązania

Jeśli Formspree nie spełnia Twoich potrzeb, możesz rozważyć:

### 1. Google Forms
- Całkowicie darmowe, bez limitów
- Wymaga przekierowania użytkownika do Google Forms
- Dane zbierane w Google Sheets

**Implementacja:**
Zamień przycisk "Zgłoś wydarzenie" na link do Google Forms.

## Dodawanie wydarzeń do kalendarza

Po otrzymaniu zgłoszenia:

1. Otwórz plik `src/data/events.json`
2. Dodaj nowe wydarzenie według wzoru:
   ```json
   {
     "id": "4",
     "title": "Tytuł z e-maila",
     "description": "Opis z e-maila",
     "date": "2026-04-20",
     "time": "10:00",
     "location": "Miejsce z e-maila",
     "organizer": "Organizator z e-maila",
     "category": "kategoria z e-maila"
   }
   ```
3. Zapisz i wdróż zmiany

## Rozwiązywanie problemów

### Formularz nie wysyła zgłoszeń

1. Sprawdź czy `YOUR_FORM_ID` został zamieniony na prawdziwe ID
2. Sprawdź konsolę przeglądarki (F12) w poszukiwaniu błędów
3. Upewnij się, że masz połączenie z internetem
4. Sprawdź czy Formspree nie wymaga potwierdzenia pierwszego zgłoszenia

### Nie otrzymuję e-maili

1. Sprawdź folder SPAM
2. Zweryfikuj adres e-mail w ustawieniach Formspree
3. Sprawdź limit miesięczny (50 zgłoszeń w planie darmowym)

### Użytkownik widzi błąd CORS

To normalne przy pierwszym zgłoszeniu - Formspree wymaga potwierdzenia. Kliknij link w e-mailu od Formspree.

## Bezpieczeństwo

Formspree automatycznie:
- Chroni przed spamem (honeypot, reCAPTCHA)
- Waliduje dane formularza
- Ukrywa Twój prawdziwy adres e-mail przed botami
- Loguje wszystkie zgłoszenia w panelu Formspree

## Monitoring

W panelu Formspree możesz:
- Zobaczyć wszystkie zgłoszenia
- Sprawdzić statystyki
- Eksportować dane do CSV
- Skonfigurować powiadomienia
