<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Progress } from '$lib/components/ui/progress';
	import { questions } from '$lib/questions.json';
	import { LocalStorage } from '$lib/storage.svelte';

	const answers = new LocalStorage('qAnswers', {
		given: [],
		lastAnswer: null
	});

	function handleSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			const qNo: number = Number(target.name.split('_')[1]);

			answers.current.given[qNo] = target.value;
			answers.current.lastAnswer[qNo] = target.name;
		}
	}
</script>

<main class="flex-col content-center justify-center py-32 md:container md:mx-auto">
	<Progress
		value={answers.current.given
			? Math.round((answers.current.given.length * 100) / questions.length)
			: 0}
	/>
	<Accordion.Root>
		<form>
			{#each questions as q, qIndex}
				<Accordion.Item value={`q_${qIndex}`}>
					<Accordion.Trigger>{`Question ${qIndex}`}</Accordion.Trigger>
					<Accordion.Content>
						<fieldset>
							<legend>{q.text}</legend>
							{#each q.options as o, oIndex}
								<p>
									<input
										onchange={handleSelect}
										type="radio"
										name={`q_${qIndex}`}
										id={`q_${qIndex}_${oIndex}`}
										value={o}
										checked={answers.current[qIndex]}
									/>
									<label for={`q_${qIndex}_${oIndex}`}>{o}</label>
								</p>
							{/each}
						</fieldset>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</form>
	</Accordion.Root>
</main>
