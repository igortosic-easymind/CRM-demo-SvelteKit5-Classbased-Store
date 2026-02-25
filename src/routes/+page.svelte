<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { 
		ArrowRight, 
		Users, 
		ChartColumn, 
		Calendar,
		CircleCheck,
		Target,
		Settings,
		Shield
	} from "@lucide/svelte";
</script>

<svelte:head>
	<title>Easymindstudio CRM - Demo Application</title>
	<meta name="description" content="Demo CRM application with client management, task tracking, and calendar system." />
</svelte:head>

<div class="min-h-screen bg-linear-to-b from-white to-gray-50">
	<!-- Navigation -->
	<nav class="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
		<div class="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center">
				<a href="/" class="flex items-center space-x-2">
					<span class="text-2xl font-bold">Easymindstudio CRM</span>
				</a>
				<div class="flex items-center space-x-4">
					<Button
						href="/login"
						class="bg-black text-white hover:bg-gray-800"
					>
						Login
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	</nav>

	<div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<!-- Hero Section -->
		<main class="text-center py-16 mb-12">
			<h1 class="text-4xl sm:text-5xl font-bold mb-6">
				CRM Demo Application
			</h1>
			<p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
				A demonstration CRM system with client management, task tracking, and calendar features. Explore the capabilities of a modern business management solution.
			</p>
		</main>

		<!-- Features Section -->
		<section class="py-12">
			<h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<div class="text-center">
					<div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<Users class="h-8 w-8 text-blue-600" />
					</div>
					<h3 class="text-xl font-semibold mb-3">Client Management</h3>
					<ul class="text-gray-600 text-sm space-y-2">
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Complete client profiles</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Lead status tracking</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Advanced search & filters</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Notes & history</li>
					</ul>
				</div>

				<div class="text-center">
					<div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<Target class="h-8 w-8 text-green-600" />
					</div>
					<h3 class="text-xl font-semibold mb-3">Task Management</h3>
					<ul class="text-gray-600 text-sm space-y-2">
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Create & organize tasks</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Priority levels & deadlines</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Status tracking</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Client associations</li>
					</ul>
				</div>

				<div class="text-center">
					<div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<Calendar class="h-8 w-8 text-purple-600" />
					</div>
					<h3 class="text-xl font-semibold mb-3">Calendar System</h3>
					<ul class="text-gray-600 text-sm space-y-2">
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Monthly & weekly views</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Event scheduling</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Task integration</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Event categories</li>
					</ul>
				</div>

				<div class="text-center">
					<div class="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
					<ChartColumn class="h-8 w-8 text-orange-600" />
					</div>
					<h3 class="text-xl font-semibold mb-3">Analytics Dashboard</h3>
					<ul class="text-gray-600 text-sm space-y-2">
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Client distribution insights</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Recent activity tracking</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Upcoming events overview</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Lead status visualization</li>
					</ul>
				</div>

				<div class="text-center">
					<div class="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<Shield class="h-8 w-8 text-indigo-600" />
					</div>
					<h3 class="text-xl font-semibold mb-3">Secure & Reliable</h3>
					<ul class="text-gray-600 text-sm space-y-2">
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Data protection</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Secure authentication</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Regular backups</li>
					<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />High availability</li>
					</ul>
				</div>

				<div class="text-center">
					<div class="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<Settings class="h-8 w-8 text-teal-600" />
					</div>
					<h3 class="text-xl font-semibold mb-3">Easy to Use</h3>
					<ul class="text-gray-600 text-sm space-y-2">
						<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Intuitive interface</li>
						<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Quick setup</li>
						<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Responsive design</li>
						<li class="flex items-center justify-center"><CircleCheck class="h-4 w-4 mr-2 text-green-500 shrink-0" />Mobile friendly</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="text-center py-12">
			<h2 class="text-3xl font-bold mb-4">Ready to explore?</h2>
			<p class="text-gray-600 mb-6">Start using the demo application today</p>
			<Button href="/login" size="lg">
				Get Started
				<ArrowRight class="ml-2 h-5 w-5" />
			</Button>
		</section>

		<footer class="text-center text-gray-600 border-t pt-8 mt-16">
			<p class="mb-4">
				Powered by{" "}
				<a
					href="https://www.easymindstudio.com/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 hover:underline"
				>
					Easymindstudio
				</a>
			</p>
			<div class="text-sm">© {new Date().getFullYear()} Demo Application - All rights reserved.</div>
		</footer>
	</div>
</div>
