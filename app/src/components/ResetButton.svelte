<script lang="ts">
	import { RotateCcw } from "lucide-svelte";
	export let onClick: () => void;
</script>

<button class="reset-button" onclick={onClick} title="Reset filters">
	<RotateCcw size={20} />
	<span>Reset</span>
</button>

<style>
	.reset-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: var(--bg-tertiary);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition:
			transform 0.2s;
		color: var(--accent-primary);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.reset-button:hover {
		transform: translateY(-1px);
		background-color: var(--bg-secondary);
	}

	.reset-button:active {
		transform: translateY(0);
	}
</style>
