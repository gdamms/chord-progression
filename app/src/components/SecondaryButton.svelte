<script lang="ts">
	export let onClick: () => void;
	export let title: string = '';
	export let children: any;
</script>

<button class="secondary-button" onclick={onClick} title={title}>
	<slot>{children}</slot>
</button>

<style>
	.secondary-button {
		width: 66px;
		height: 66px;
		background-color: var(--bg-tertiary);
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s;
		padding: 0;
		color: var(--text-accent-secondary);
		font-size: 2.5rem;
	}

	@media (hover: hover) {
		.secondary-button:hover {
			animation: jump 0.2s linear;
		}
	}

	@keyframes jump {
		0% {
			transform: translateY(0);
		}
		10% {
			transform: translateY(-6px) scaleX(0.9) scaleY(1.1);
		}
		80% {
			transform: translateY(4px) scaleX(1.1) scaleY(0.9);
		}
		100% {
			transform: translateY(0);
		}
	}

	.secondary-button:active {
		/* background-color: var(--bg-tertiary); */
		transform: scaleX(1.1) scaleY(0.95);
		transition:
			transform 0.05s,
			background-color 0.05s ease-in;
	}
</style>