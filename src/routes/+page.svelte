<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Progress } from '$lib/components/ui/progress';
	import { questions } from '$lib/questions.json';
	import Canvas from '@/lib/components/ui/Canvas.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const DEFAULT_Q = 'q_0';
	const DEFAULT_ANS = {
		given: [] as string[],
		lastAnswer: '',
		lastQuestion: '',
		progress: 0
	};

	let answerError: string | undefined = $state();
	let answers = $state(DEFAULT_ANS);
	let currentQuestion: string = $state(DEFAULT_Q);

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const qNo: number = Number(target.name.split('_')[1]);

		const currentQ = questions[qNo];
		const correctAnsId = currentQ.answerId;
		const correctAns = currentQ.options[correctAnsId];

		if (correctAns !== target.value) {
			answerError = 'Incorrect answer, please try again';
			return;
		}
		answerError = '';
		answers.given[qNo] = target.value;
		answers.progress = Math.round((answers.given.length * 100) / questions.length);
		currentQuestion = `q_${qNo + 1}`;

		console.log({ currentQuestion });
	}

	function handleRestart() {
		answers = DEFAULT_ANS;
		currentQuestion = DEFAULT_Q;
		answerError = '';
		location.reload();
	}

	function shuffle<T>(array: T[]): T[] {
		// Create a copy to avoid mutating the original array (optional)
		let currentIndex = array.length;
		const arr = [...array];

		// While there remain elements to shuffle...
		while (currentIndex > 0) {
			// Pick a remaining element
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// Swap with the current element
			let curr = arr[currentIndex] 
			arr[currentIndex] = arr[randomIndex];
			arr[randomIndex] = curr;
		}

		return arr;
	}
</script>

<nav class="nav">
	<h1 class="px-2 text-2xl text-gray-200 md:px-4 md:py-2 md:text-4xl">Ziltoid The Omniscient</h1>
	<Button class="m-4" variant="outline" onclick={handleRestart} data-sveltekit-reload
		>Restart</Button
	>
</nav>
<Progress value={answers.progress} />
<main class="w-full flex-col content-center justify-center px-4 md:container md:mx-auto md:px-32">
	<Canvas progress={answers.progress} />

	<Accordion.Root type="single" bind:value={currentQuestion}>
		<form class="form">
			{#each questions as q, qIndex}
				<Accordion.Item value={`q_${qIndex}`}>
					<Accordion.Trigger>
						{`Question ${qIndex + 1} : ${q.text.length > 70 ? q.text.substring(0, 70) + '...' : q.text}`}
					</Accordion.Trigger>	
					<Accordion.Content>
						<fieldset class="px-4">
							<ul class="text-xl">
								{#each shuffle(q.options) as o, oIndex}
									<li>
										<p id={`q_${qIndex}_${oIndex}`} data-q={`q_${qIndex}`}>
											- {o}
										</p>
									</li>
								{/each}
								<hr class="my-8" />
								{#if answerError}
									<Alert.Root class="my-8">
										<Alert.Title>Incorrect</Alert.Title>
										<Alert.Description>
											{answerError}
										</Alert.Description>
									</Alert.Root>
								{/if}
								<label class="my-8" for={`q_${qIndex}`}>Answer the questions below: </label>
								<Input
									class="my-4 p-4"
									onchange={handleChange}
									type="text"
									name={`q_${qIndex}`}
									id={`q_${qIndex}`}
									value={answers.given[qIndex]}
									disabled={currentQuestion !== `q_${qIndex}`}
								/>
							</ul>
						</fieldset>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</form>
		{#if answers.progress == 100}
			<Dialog.Root open={true}>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Got that coffee token!</Dialog.Title>
						<Dialog.Description>Here's your flag: [THM_ZiltoidiaAttaxx!!]</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</Accordion.Root>
</main>

<style>
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--color-main);
		position: sticky;
		top: 0;
		overflow: hidden;
		z-index: 1;
		height: 4rem;
	}
</style>
