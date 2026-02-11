#!/usr/bin/env tsx
/**
 * Chord Parsing Validation Script
 * 
 * This script validates that all chord progressions in the dataset can be properly parsed.
 * It reports any parsing errors with specific line numbers, progression strings, and failing chords.
 * 
 * Usage:
 *   npx tsx validate-chords.ts
 *   or
 *   npm run validate-chords
 */

// @ts-nocheck - This is a standalone Node.js script, types are handled by tsx at runtime

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Chord } from './src/lib/chords/Chord.js';
import { Progression } from './src/lib/chords/Progression.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validation results
interface ValidationError {
	lineNumber: number;
	lineContent: string;
	progressionString: string;
	key: string;
	errorMessage: string;
	failingChord?: string;
}

function validateProgressionsFile(filePath: string): {
	totalLines: number;
	validProgressions: number;
	errors: ValidationError[];
} {
	const content = readFileSync(filePath, 'utf-8');
	const lines = content.split('\n');
	
	let validProgressions = 0;
	const errors: ValidationError[] = [];

	lines.forEach((line: string, index: number) => {
		const lineNumber = index + 1;
		const trimmed = line.trim();
		
		// Skip empty lines
		if (!trimmed) return;

		try {
			const parts = trimmed.split(',');
			const progStr = parts[0].trim();
			const key = parts.length > 1 ? parts[1].trim() : 'C';

			// Try to validate each chord individually to identify the specific failing chord
			const chordStrings = progStr.split(' ');
			let failingChord: string | undefined;

			for (const chordStr of chordStrings) {
				try {
					Chord.fromString(chordStr);
				} catch (chordError) {
					failingChord = chordStr;
					throw chordError;
				}
			}

			// Try to parse the entire progression
			Progression.fromString(progStr, key);
			validProgressions++;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			const parts = trimmed.split(',');
			const progStr = parts[0].trim();
			const key = parts.length > 1 ? parts[1].trim() : 'C';
			
			// Try to identify which chord failed
			let failingChord: string | undefined;
			const chordStrings = progStr.split(' ');
			for (const chordStr of chordStrings) {
				try {
					Chord.fromString(chordStr);
				} catch {
					failingChord = chordStr;
					break;
				}
			}

			errors.push({
				lineNumber,
				lineContent: trimmed,
				progressionString: progStr,
				key,
				errorMessage,
				failingChord
			});
		}
	});

	return {
		totalLines: lines.filter((l: string) => l.trim()).length,
		validProgressions,
		errors
	};
}

// Main execution
function main() {
	console.log('🎵 Chord Progression Validation Script\n');
	console.log('=' .repeat(60));

	const progressionsPath = join(__dirname, 'src', 'lib', 'data', 'progressions.txt');
	
	try {
		console.log(`\n📂 Reading file: ${progressionsPath}\n`);
		
		const results = validateProgressionsFile(progressionsPath);
		
		console.log(`✅ Valid progressions: ${results.validProgressions}/${results.totalLines}`);
		console.log(`❌ Failed progressions: ${results.errors.length}/${results.totalLines}`);
		console.log('=' .repeat(60));

		if (results.errors.length > 0) {
			console.log('\n🔍 Parsing Errors:\n');
			
			results.errors.forEach((error, index) => {
				console.log(`\nError ${index + 1}:`);
				console.log(`  Line: ${error.lineNumber}`);
				console.log(`  Content: "${error.lineContent}"`);
				console.log(`  Progression: "${error.progressionString}"`);
				console.log(`  Key: ${error.key}`);
				if (error.failingChord) {
					console.log(`  ⚠️  Failing chord: "${error.failingChord}"`);
				}
				console.log(`  Error: ${error.errorMessage}`);
				console.log('-'.repeat(60));
			});

			console.log(`\n❌ Validation FAILED: ${results.errors.length} error(s) found.`);
			process.exit(1);
		} else {
			console.log('\n✅ All progressions parsed successfully!');
			process.exit(0);
		}
	} catch (error) {
		console.error('\n💥 Fatal error:', error);
		process.exit(1);
	}
}

// Run the main function
main();

export { validateProgressionsFile, Chord, Progression };
