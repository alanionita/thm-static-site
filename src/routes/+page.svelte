<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Progress } from '$lib/components/ui/progress';
	import { questions } from '$lib/questions.json';
</script>

<main class="flex-col content-center justify-center py-32 md:container md:mx-auto">
	<Progress value={33} />
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
									<input type="radio" name={`q_${qIndex}`} id={`q_${qIndex}_${oIndex}`} value={o} />
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
