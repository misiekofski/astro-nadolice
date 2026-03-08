export type EventCategory = string;

export type BaseEvent = {
	id: string;
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	organizer: string;
	category: EventCategory;
	recurrence?: Recurrence;
};

export type Recurrence =
	| {
			type: 'monthly';
			intervalMonths?: number;
			dayOfMonth?: number;
			until?: string;
		}
	| {
			type: 'nthWeekdayOfMonth';
			weekday: number;
			nth: number;
			intervalMonths?: number;
			until?: string;
		};

export type ExpandedEvent = Omit<BaseEvent, 'recurrence'> & {
	originalId: string;
};

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parseDateOnly = (isoDate: string) => {
	const [y, m, d] = isoDate.split('-').map((p) => Number(p));
	return new Date(y, m - 1, d);
};

const formatIsoDate = (d: Date) => {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
};

const isValidDate = (d: Date) => !Number.isNaN(d.getTime());

const daysInMonth = (year: number, monthZeroBased: number) => {
	return new Date(year, monthZeroBased + 1, 0).getDate();
};

const nthWeekdayOfMonth = (year: number, monthZeroBased: number, weekday: number, nth: number) => {
	if (weekday < 0 || weekday > 6) return null;
	if (nth < 1 || nth > 5) return null;

	const first = new Date(year, monthZeroBased, 1);
	const firstWeekday = first.getDay();
	const delta = (weekday - firstWeekday + 7) % 7;
	const day = 1 + delta + (nth - 1) * 7;

	const dim = daysInMonth(year, monthZeroBased);
	if (day > dim) return null;
	return new Date(year, monthZeroBased, day);
};

const addMonths = (d: Date, months: number) => {
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();

	const target = new Date(year, month + months, 1);
	const dim = daysInMonth(target.getFullYear(), target.getMonth());
	return new Date(target.getFullYear(), target.getMonth(), Math.min(day, dim));
};

const makeOccurrence = (event: BaseEvent, occurrenceDate: Date): ExpandedEvent => {
	const dateIso = formatIsoDate(occurrenceDate);
	return {
		id: `${event.id}@${dateIso}`,
		originalId: event.id,
		title: event.title,
		description: event.description,
		date: dateIso,
		time: event.time,
		location: event.location,
		organizer: event.organizer,
		category: event.category,
	};
};

export const expandEventsInRange = (events: BaseEvent[], rangeStart: Date, rangeEnd: Date): ExpandedEvent[] => {
	const start = toDateOnly(rangeStart);
	const end = toDateOnly(rangeEnd);
	const results: ExpandedEvent[] = [];

	for (const event of events) {
		const baseDate = parseDateOnly(event.date);
		if (!isValidDate(baseDate)) continue;

		if (!event.recurrence) {
			const d = toDateOnly(baseDate);
			if (d >= start && d <= end) {
				results.push(makeOccurrence(event, d));
			}
			continue;
		}

		const until = event.recurrence.until ? toDateOnly(parseDateOnly(event.recurrence.until)) : null;
		const effectiveEnd = until && until < end ? until : end;
		if (effectiveEnd < start) continue;

		const intervalMonths = event.recurrence.intervalMonths && event.recurrence.intervalMonths > 0 ? event.recurrence.intervalMonths : 1;

		let cursor = toDateOnly(baseDate);
		let guard = 0;
		while (cursor <= effectiveEnd) {
			guard += 1;
			if (guard > 500) break;

			let occurrence: Date | null = null;
			if (event.recurrence.type === 'monthly') {
				const dom = event.recurrence.dayOfMonth ?? cursor.getDate();
				const dim = daysInMonth(cursor.getFullYear(), cursor.getMonth());
				if (dom <= dim) {
					occurrence = new Date(cursor.getFullYear(), cursor.getMonth(), dom);
				}
			} else if (event.recurrence.type === 'nthWeekdayOfMonth') {
				occurrence = nthWeekdayOfMonth(cursor.getFullYear(), cursor.getMonth(), event.recurrence.weekday, event.recurrence.nth);
			}

			if (occurrence) {
				const occ = toDateOnly(occurrence);
				if (occ >= start && occ <= effectiveEnd) {
					results.push(makeOccurrence(event, occ));
				}
			}

			cursor = addMonths(cursor, intervalMonths);
		}
	}

	results.sort((a, b) => parseDateOnly(a.date).valueOf() - parseDateOnly(b.date).valueOf());

	// De-dup by (title, date, time, location, organizer) in case of overlaps
	const seen = new Set<string>();
	return results.filter((e) => {
		const key = `${e.title}|${e.date}|${e.time}|${e.location}|${e.organizer}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

export const daysBetween = (a: Date, b: Date) => {
	const ad = toDateOnly(a).getTime();
	const bd = toDateOnly(b).getTime();
	return Math.round((bd - ad) / MS_IN_DAY);
};
