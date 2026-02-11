import { Progression } from './Progression';

export class ProgManager {
	static parseProgressions(fileContent: string): Progression[] {
		const progressions: Progression[] = [];
		const lines = fileContent.split('\n');

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;

			const parts = trimmed.split(',');
			const progStr = parts[0].trim();
			const key = parts.length > 1 ? parts[1].trim() : 'C';

			try {
				const prog = Progression.fromString(progStr, key);
				progressions.push(prog);
			} catch (e) {
				console.warn(`Failed to parse progression: ${trimmed}`, e);
			}
		}

		return progressions;
	}

	static getRandomProg(list: Progression[]): Progression | null {
		if (list.length === 0) return null;
		const index = Math.floor(Math.random() * list.length);
		return list[index].copy();
	}

	static getRandomProgByChordCount(list: Progression[], nbChords: number): Progression | null {
		const filtered = list.filter((p) => p.getNbChords() === nbChords);
		if (filtered.length === 0) return null;
		const index = Math.floor(Math.random() * filtered.length);
		return filtered[index].copy();
	}

	static getRandomProgByChordType(list: Progression[], chordTypes: string[]): Progression | null {
		if (chordTypes.length === 0) return ProgManager.getRandomProg(list);

		const filtered = list.filter((prog) => {
			return prog.chords.some((chord) => {
				// Check if chord type matches any of the filter types
				if (chordTypes.includes('all')) return true;
				if (chordTypes.includes('major') && chord.type === '') return true;
				if (chordTypes.includes('minor') && chord.type === 'm') return true;
				if (chordTypes.includes('seventh') && (chord.add.includes('7') || chord.add.includes('maj7'))) return true;
				if (chordTypes.includes('dim') && chord.type === 'dim') return true;
				if (chordTypes.includes('aug') && chord.type === 'aug') return true;
				return false;
			});
		});

		if (filtered.length === 0) return null;
		const index = Math.floor(Math.random() * filtered.length);
		return filtered[index].copy();
	}

	static filterProgressions(
		list: Progression[],
		maxChords?: number,
		chordTypes?: string[]
	): Progression[] {
		let filtered = [...list];

		if (maxChords !== undefined && maxChords > 0) {
			filtered = filtered.filter((p) => p.getNbChords() <= maxChords);
		}

		if (chordTypes && chordTypes.length > 0 && !chordTypes.includes('all')) {
			filtered = filtered.filter((prog) => {
				return prog.chords.some((chord) => {
					if (chordTypes.includes('major') && chord.type === '') return true;
					if (chordTypes.includes('minor') && chord.type === 'm') return true;
					if (chordTypes.includes('seventh') && (chord.add.includes('7') || chord.add.includes('maj7'))) return true;
					if (chordTypes.includes('dim') && chord.type === 'dim') return true;
					if (chordTypes.includes('aug') && chord.type === 'aug') return true;
					return false;
				});
			});
		}

		return filtered;
	}
}
