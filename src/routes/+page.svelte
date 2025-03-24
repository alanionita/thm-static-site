<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Progress } from '$lib/components/ui/progress';
	import { questions } from '$lib/questions.json';
	import Canvas from '@/lib/components/ui/Canvas.svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	let answers = $state({
		given: [] as string[],
		lastAnswer: '',
		lastQuestion: '',
		progress: 0
	});

	let inputError: string | undefined = $state();
	let currentQuestion: string = $state('q_0');

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const qNo: number = Number(target.name.split('_')[1]);

		const currentQ = questions[qNo];
		const correctAnsId = currentQ.answerId;
		const correctAns = currentQ.options[correctAnsId];

		if (correctAns !== target.value) {
			inputError = 'Incorrect answer, please try again';
			return;
		}
		inputError = '';
		answers.given[qNo] = target.value;
		answers.progress = Math.round((answers.given.length * 100) / questions.length);
		currentQuestion = `q_${qNo + 1}`;
	}
</script>

<Progress value={answers.progress}/>
<main class="w-full flex-col content-center justify-center px-4 md:container md:mx-auto md:px-32">	
	<Canvas progress={answers.progress} />

	<Accordion.Root type="single" bind:value={currentQuestion}>
		<form class="form">
			{#each questions as q, qIndex}
				<Accordion.Item value={`q_${qIndex}`} disabled={currentQuestion !== `q_${qIndex}`}>
					<Accordion.Trigger
						>{`Question ${qIndex + 1} : ${q.text.substring(0, 80)}`}</Accordion.Trigger
					>
					<Accordion.Content>
						<fieldset class="px-4">
							<ul>
								{#each q.options as o, oIndex}
									<li>
										<p id={`q_${qIndex}_${oIndex}`} data-q={`q_${qIndex}`}>
											- {o}
										</p>
									</li>
								{/each}
								<hr class="my-8" />
								{#if inputError}
									<Alert.Root class="my-8">
										<Alert.Title>Incorrect</Alert.Title>
										<Alert.Description>
											{inputError}
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
