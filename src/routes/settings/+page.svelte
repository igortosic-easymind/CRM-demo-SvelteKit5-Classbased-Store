<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select/index.js";
  import { 
    Construction, 
    Bell, 
    User, 
    Shield, 
    Palette, 
    Database 
  } from "@lucide/svelte/icons";
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Settings</h1>
  </div>

  <!-- Alert -->
  <div class="border-dashed bg-yellow-500 border rounded-lg p-4 flex items-start gap-2">
    <Construction class="h-4 w-4 mt-0.5" />
    <p class="text-sm">
      This page is currently under construction. The controls below are for demonstration purposes only.
    </p>
  </div>

  <!-- Profile Settings -->
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <User class="h-5 w-5" />
        <div>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <Label for="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" disabled />
        </div>
        <div class="space-y-2">
          <Label for="email">Email Address</Label>
          <Input id="email" placeholder="john@example.com" disabled />
        </div>
      </div>
      <Button class="mt-2" disabled>
        Save Changes
      </Button>
    </CardContent>
  </Card>

  <!-- Notification Preferences -->
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <Bell class="h-5 w-5" />
        <div>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Email Notifications</Label>
            <p class="text-sm text-muted-foreground">Receive updates via email</p>
          </div>
          <Switch disabled />
        </div>
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Browser Notifications</Label>
            <p class="text-sm text-muted-foreground">Get desktop notifications</p>
          </div>
          <Switch disabled />
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Display Settings -->
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <Palette class="h-5 w-5" />
        <div>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Customize your viewing experience</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label>Theme</Label>
          <select disabled class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-500">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Compact Mode</Label>
            <p class="text-sm text-muted-foreground">Reduce spacing and padding</p>
          </div>
          <Switch disabled />
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Security Settings -->
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <Shield class="h-5 w-5" />
        <div>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your security preferences</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <Button variant="outline" disabled>
          Change Password
        </Button>
        <Button variant="outline" disabled>
          Enable Two-Factor Authentication
        </Button>
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label>Session Timeout</Label>
            <p class="text-sm text-muted-foreground">Automatically log out after inactivity</p>
          </div>
          <select disabled class="w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-500">
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Data Management -->
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <Database class="h-5 w-5" />
        <div>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Control your data and exports</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <Button variant="outline" disabled>
        Export All Data
      </Button>
      <Button variant="outline" disabled>
        Request Data Report
      </Button>
      <Button variant="destructive" disabled>
        Delete Account
      </Button>
    </CardContent>
  </Card>
</div> 