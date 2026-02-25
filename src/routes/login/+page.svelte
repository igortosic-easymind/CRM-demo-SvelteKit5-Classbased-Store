<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import type { AuthResponse } from "$lib/types";
	import { Button } from "$lib/components/ui/button/index.js";
	import { ArrowRight } from "@lucide/svelte";

	export let form: AuthResponse;
</script>
<nav class="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
	<div class="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center">
			<a href="/" class="flex items-center space-x-2">
				<span class="text-2xl font-bold">Easymindstudio CRM</span>
			</a>
		</div>
	</div>
</nav>

<div class="flex w-full items-center justify-center px-4 py-20">
	<LoginForm {form} />
</div>