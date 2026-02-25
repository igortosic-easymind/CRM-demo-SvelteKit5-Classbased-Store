<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { enhance } from "$app/forms";
	
	export let form: { success?: boolean; error?: string } = {};
	let isLoading = false;
	
	function handleSubmit() {
		isLoading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isLoading = false;
		};
	}
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your username below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:enhance={handleSubmit}>
			<div class="grid gap-4">
				{#if form?.error}
					<div class="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
						{form.error}
					</div>
				{/if}
				<div class="grid gap-2">
					<Label for="email">User Name</Label>
					<Input id="email" name="email" type="text" placeholder="username" required />
				</div>
				<div class="grid gap-2">
					<!-- <div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="/forgot-password" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div> -->
					<Input id="password" name="password" type="password" required />
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{isLoading ? 'Logging in...' : 'Login'}
				</Button>
				<!-- <Button variant="outline" class="w-full" type="button">Login with Google</Button> -->
			</div>
		</form>
		<!-- <div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/register" class="underline"> Sign up </a>
		</div> -->
	</Card.Content>
</Card.Root>