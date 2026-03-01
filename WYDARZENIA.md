# Zarządzanie Kalendarzem Wydarzeń

## Przegląd

System kalendarza wydarzeń pozwala na prezentację lokalnych wydarzeń organizowanych przez NGO w Nadolicach Wielkich. System jest oparty na prostym pliku JSON, co eliminuje potrzebę bazy danych i backendu.

## Struktura danych

Wydarzenia są przechowywane w pliku: `src/data/events.json`

### Format wydarzenia

```json
{
  "id": "unikalny-identyfikator",
  "title": "Tytuł wydarzenia",
  "description": "Krótki opis wydarzenia",
  "date": "2026-03-15",
  "time": "17:00",
  "location": "Miejsce wydarzenia",
  "organizer": "Nazwa organizatora",
  "category": "spotkanie"
}
```

### Dostępne kategorie

- `spotkanie` - spotkania organizacji (niebieski)
- `sport` - wydarzenia sportowe (zielony)
- `akcja` - akcje społeczne (pomarańczowy)
- `kultura` - wydarzenia kulturalne (fioletowy)
- `inne` - pozostałe wydarzenia (szary)

## Sposoby dodawania wydarzeń

### 1. Formularz online (dla użytkowników)

Użytkownicy mogą zgłaszać wydarzenia przez formularz na stronie:
- URL: `/zglos-wydarzenie`
- Formularz generuje wiadomość e-mail z danymi wydarzenia
- E-mail jest wysyłany na adres: `michal@ksnadolice.ovh`

**Uwaga:** Musisz skonfigurować adres e-mail `michal@ksnadolice.ovh` lub zmienić adres w plikach:
- `src/pages/zglos-wydarzenie.astro` (linia 156)

### 2. Edycja ręczna (dla administratorów)

#### Krok 1: Otwórz plik z wydarzeniami
```bash
src/data/events.json
```

#### Krok 2: Dodaj nowe wydarzenie
Dodaj nowy obiekt do tablicy JSON:

```json
{
  "id": "4",
  "title": "Nazwa wydarzenia",
  "description": "Opis wydarzenia",
  "date": "2026-05-10",
  "time": "18:00",
  "location": "Miejsce",
  "organizer": "Organizator",
  "category": "kultura"
}
```

**Ważne:**
- ID musi być unikalne
- Data w formacie: `YYYY-MM-DD`
- Czas w formacie: `HH:MM` (24h)
- Nie zapomnij o przecinkach między obiektami
- Sprawdź poprawność składni JSON

#### Krok 3: Zapisz i wdróż
```bash
git add src/data/events.json
git commit -m "Dodano nowe wydarzenie: [nazwa]"
git push
```

### 3. Przez e-mail (dla organizatorów)

Organizatorzy mogą wysyłać informacje o wydarzeniach na adres:
`michal@ksnadolice.ovh`

**Wymagane informacje:**
- Tytuł wydarzenia
- Opis
- Data i godzina
- Miejsce
- Organizator
- Kategoria

Administrator następnie ręcznie dodaje wydarzenie do pliku JSON.

## Automatyczne funkcje

### Sortowanie
- Wydarzenia są automatycznie sortowane według daty
- Na stronie głównej wyświetlane są tylko 4 najbliższe wydarzenia
- Na stronie `/wydarzenia` wszystkie wydarzenia są podzielone na nadchodzące i minione

### Filtrowanie
- Wydarzenia przeszłe są automatycznie przenoszone do sekcji "Minione wydarzenia"
- System porównuje datę wydarzenia z aktualną datą

## Utrzymanie

### Usuwanie starych wydarzeń

Zaleca się okresowe czyszczenie starych wydarzeń (np. co 6 miesięcy):

1. Otwórz `src/data/events.json`
2. Usuń wydarzenia starsze niż 6 miesięcy
3. Zapisz i wdróż zmiany

### Backup

Przed większymi zmianami zaleca się utworzenie kopii zapasowej:

```bash
cp src/data/events.json src/data/events.json.backup
```

## Rozwiązywanie problemów

### Wydarzenie nie wyświetla się

1. Sprawdź poprawność składni JSON (użyj walidatora JSON online)
2. Upewnij się, że data jest w przyszłości
3. Sprawdź czy wszystkie wymagane pola są wypełnione

### Błąd składni JSON

Najczęstsze problemy:
- Brakujący przecinek między obiektami
- Dodatkowy przecinek po ostatnim obiekcie
- Nieprawidłowy format daty/czasu
- Niezamknięte cudzysłowy

### Formularz nie działa

1. Sprawdź czy użytkownik ma skonfigurowanego klienta poczty
2. Zweryfikuj adres e-mail w pliku `zglos-wydarzenie.astro`
3. Użytkownik może alternatywnie wysłać e-mail ręcznie

## Przykładowe wydarzenia

```json
[
  {
    "id": "1",
    "title": "Spotkanie Koła Gospodyń Wiejskich",
    "description": "Comiesięczne spotkanie członkiń KGW.",
    "date": "2026-03-15",
    "time": "17:00",
    "location": "Świetlica wiejska",
    "organizer": "Koło Gospodyń Wiejskich",
    "category": "spotkanie"
  },
  {
    "id": "2",
    "title": "Turniej piłki nożnej",
    "description": "Coroczny turniej dla drużyn amatorskich.",
    "date": "2026-04-20",
    "time": "10:00",
    "location": "Boisko sportowe",
    "organizer": "KS Nadolice",
    "category": "sport"
  }
]
```

## Przyszłe ulepszenia

Możliwe rozszerzenia systemu:
- Integracja z Google Calendar
- Automatyczne przypomnienia e-mail
- System komentarzy
- Galeria zdjęć z wydarzeń
- Eksport do formatu iCal
- Panel administracyjny (wymaga backendu)
