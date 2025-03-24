<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import { Progress } from '$lib/components/ui/progress';
	import { questions } from '$lib/questions.json';
	import { LocalStorage } from '$lib/storage.svelte';
	import Canvas from '@/lib/components/ui/Canvas.svelte';

	// const answers = new LocalStorage('qAnswers', {
	// 	given: [],
	// 	lastAnswer: null,
	// 	progress: 0
	// });

	let answers = $state({
		current: {
			given: [] as string[],
			lastAnswer: '',
			lastQuestion: '',
			progress: 0
		}
	});

	let inputError: string | undefined = $state();
	let currentQuestion: string = $state('q_0');

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const qNo: number = Number(target.name.split('_')[1]);
		const currentQ = questions[qNo];
		if (answers.current) {
			const correctAnsId = currentQ.answerId;
			const correctAns = currentQ.options[correctAnsId];

			if (correctAns !== target.value) {
				inputError = 'Incorrect answer, please try again';
				return;
			}
			answers.current.given[qNo] = target.value;
			answers.current.progress = Math.round(
				(answers.current.given.length * 100) / questions.length
			);
			currentQuestion = target.name;
		}
	}
</script>

<main class="flex-col content-center justify-center py-32 md:container md:mx-auto">
	<Canvas progress={answers.current.progress} />
	<Progress value={answers.current.progress} />
	<Accordion.Root>
		<form>
			{#each questions as q, qIndex}
				<Accordion.Item value={`q_${qIndex}`}>
					<Accordion.Trigger>{`Question ${qIndex + 1}`}</Accordion.Trigger>
					<Accordion.Content>
						<fieldset>
							<legend>{q.text}</legend>
							{#if inputError}
								<Alert.Root>
									<Alert.Title>Incorrect</Alert.Title>
									<Alert.Description>
										{inputError}
									</Alert.Description>
								</Alert.Root>
							{/if}
							<ul>
								{#each q.options as o, oIndex}
									<li>
										<p id={`q_${qIndex}_${oIndex}`} data-q={`q_${qIndex}`}>
											{o}
										</p>
									</li>
								{/each}
								<label for={`q_${qIndex}`}>Insert Answer: </label>
								<input
									onchange={handleChange}
									type="text"
									name={`q_${qIndex}`}
									id={`q_${qIndex}`}
									value={answers.current.given[qIndex]}
									disabled={currentQuestion !== `q_${qIndex}`}
								/>
							</ul>
						</fieldset>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</form>
	</Accordion.Root>
</main>
