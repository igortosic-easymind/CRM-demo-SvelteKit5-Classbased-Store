<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import type { Client, ContactCreate } from "$lib/types";
  import { enhance } from "$app/forms";
  import Plus from "@lucide/svelte/icons/plus";
  import X from "@lucide/svelte/icons/x";
  import DeleteContactDialog from "./delete-contact-dialog.svelte";

  // Props with default values for a new client
  let {
    client = undefined,
    form = {},
    isSubmitting = false,
  }: {
    client?: Client;
    form?: { success?: boolean; error?: string } | null;
    isSubmitting?: boolean;
  } = $props();

  const isEditMode = $derived(!!client);
  const formTitle = $derived(isEditMode ? "Edit Client" : "Add New Client");
  const submitText = $derived(isEditMode ? "Update Client" : "Create Client");

  // Initialize contacts - use existing contacts or create from legacy fields
  let contacts = $state<ContactCreate[]>([]);

  // Initialize contacts when component loads
  $effect(() => {
    if (client?.contacts && client.contacts.length > 0) {
      // Use existing contacts - preserve IDs for updates
      contacts = client.contacts.map((contact: ContactCreate) => ({
        id: contact.id, // Preserve ID for updates
        first_name: contact.first_name,
        last_name: contact.last_name,
        position: contact.position,
        phone: contact.phone,
        email: contact.email,
        is_primary: contact.is_primary
      }));
    } else {
      // New client - start with one empty contact (no ID)
      contacts = [{
        first_name: "",
        last_name: "",
        position: "",
        phone: "",
        email: "",
        is_primary: true
      }];
    }
  });

  function addContact() {
    contacts = [...contacts, {
      first_name: "",
      last_name: "",
      position: "",
      phone: "",
      email: "",
      is_primary: false
    }];
  }

  function removeContact(index: number) {
    if (contacts.length > 1) {
      contacts = contacts.filter((_, i) => i !== index);
      // Ensure at least one contact is primary
      if (!contacts.some(c => c.is_primary)) {
        contacts[0].is_primary = true;
      }
    }
  }

  function setPrimary(index: number) {
    // Create a completely new array to ensure reactivity
    contacts = contacts.map((contact, i) => {
      return {
        ...contact,
        is_primary: i === index
      };
    });
  }

  // Form enhancement to handle loading state
  function handleSubmit() {
    isSubmitting = true;

    return async ({ formData, update }: { formData: FormData; update: () => Promise<void> }) => {
      // Convert $state proxies to plain objects
      const contactsSnapshot = $state.snapshot(contacts);
      
      // Ensure only one contact is marked as primary
      const primaryIndex = contactsSnapshot.findIndex(contact => contact.is_primary);
      const processedContacts = contactsSnapshot.map((contact, index) => {
        const baseContact = {
          first_name: contact.first_name,
          last_name: contact.last_name,
          position: contact.position,
          phone: contact.phone,
          email: contact.email,
          is_primary: index === primaryIndex
        };
        
        // Only include ID if it exists (for existing contacts)
        if (contact.id) {
          return { id: contact.id, ...baseContact };
        }
        
        // New contacts don't have IDs
        return baseContact;
      });
      
      const primaryContact = processedContacts[primaryIndex] || processedContacts[0];
      
      // Add contacts as JSON (this will override the hidden inputs)
      formData.set('contacts', JSON.stringify(processedContacts));
      formData.set('contact_count', processedContacts.length.toString());
      formData.set('primary_contact', JSON.stringify(primaryContact));
      
      await update();
      isSubmitting = false;
    };
  }
</script>

<Card.Root class="mx-auto w-full max-w-3xl">
  <Card.Header>
    <Card.Title class="text-2xl">{formTitle}</Card.Title>
    <Card.Description>
      {isEditMode ? "Update client information" : "Enter information to create a new client"}
    </Card.Description>
  </Card.Header>

  <form method="POST" use:enhance={handleSubmit} class="space-y-8">
    <Card.Content class="space-y-6">
      {#if form?.error}
        <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {form.error}
        </div>
      {/if}

      <!-- Company Information -->
      <div>
        <h3 class="mb-4 font-medium">Company Information</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="company_name">Company Name</Label>
            <Input id="company_name" name="company_name" value={client?.company_name || ""} required />
          </div>

          <div class="space-y-2">
            <Label for="website">Website</Label>
            <Input id="website" name="website" type="text" value={client?.website || ""} />
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-medium">Contact Information</h3>
          <Button type="button" variant="outline" size="sm" onclick={addContact}>
            <Plus class="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <div class="space-y-6">
          {#each contacts as contact, index (contact.id || index)}
            <div class="rounded-md border p-4">
              <div class="mb-4 flex items-center justify-between">
                <h4 class="text-sm font-medium">Contact {index + 1}</h4>
                <div class="flex items-center gap-2">
                  {#if contact.is_primary}
                    <span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">Primary</span>
                  {:else}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onclick={() => setPrimary(index)}
                      class="text-xs"
                    >
                      Set as Primary
                    </Button>
                  {/if}
                  {#if contacts.length > 1}
                    {#if contact.id}
                      <!-- Server-side delete for existing contacts -->
                      <DeleteContactDialog 
                        contact={contact} 
                        clientId={client?.id || 0}
                      />
                    {:else}
                      <!-- Client-side remove for new contacts -->
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onclick={() => removeContact(index)}
                        class="h-6 w-6 text-destructive"
                      >
                        <X class="h-3 w-3" />
                      </Button>
                    {/if}
                  {/if}
                </div>
              </div>



              <!-- Contact form fields -->
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="contacts_{index}_first_name">First Name *</Label>
                  <Input 
                    id="contacts_{index}_first_name" 
                    bind:value={contact.first_name} 
                    required 
                  />
                </div>

                <div class="space-y-2">
                  <Label for="contacts_{index}_last_name">Last Name *</Label>
                  <Input 
                    id="contacts_{index}_last_name" 
                    bind:value={contact.last_name} 
                    required 
                  />
                </div>

                <div class="space-y-2">
                  <Label for="contacts_{index}_position">Position</Label>
                  <Input 
                    id="contacts_{index}_position" 
                    bind:value={contact.position} 
                  />
                </div>

                <div class="space-y-2">
                  <Label for="contacts_{index}_email">Email *</Label>
                  <Input 
                    id="contacts_{index}_email" 
                    type="email" 
                    bind:value={contact.email} 
                    required 
                  />
                </div>

                <div class="space-y-2">
                  <Label for="contacts_{index}_phone">Phone</Label>
                  <Input 
                    id="contacts_{index}_phone" 
                    bind:value={contact.phone} 
                  />
                </div>

                <div class="space-y-2">
                  <Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">&nbsp;</Label>
                  <div class="flex items-center space-x-2">
                    <Checkbox 
                      id="contacts_{index}_is_primary" 
                      checked={contact.is_primary}
                      onCheckedChange={() => setPrimary(index)}
                    />
                    <Label for="contacts_{index}_is_primary" class="text-sm">Primary contact</Label>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Address Information -->
      <div>
        <h3 class="mb-4 font-medium">Address</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2 md:col-span-2">
            <Label for="address">Street Address</Label>
            <Input id="address" name="address" value={client?.address || ""} />
          </div>

          <div class="space-y-2">
            <Label for="city">City</Label>
            <Input id="city" name="city" value={client?.city || ""} />
          </div>

          <div class="space-y-2">
            <Label for="state">State/Province</Label>
            <Input id="state" name="state" value={client?.state || ""} />
          </div>

          <div class="space-y-2">
            <Label for="zipcode">Zip/Postal Code</Label>
            <Input id="zipcode" name="zipcode" value={client?.zipcode || ""} />
          </div>
        </div>
      </div>

      <!-- Lead Information -->
      <div>
        <h3 class="mb-4 font-medium">Lead Information</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="lead">Lead Status</Label>
            <select
              id="lead"
              name="lead"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="cold" selected={client?.lead === "cold"}>Cold</option>
              <option value="warm" selected={client?.lead === "warm"}>Warm</option>
              <option value="hot" selected={client?.lead === "hot"}>Hot</option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="linkedin_connection">LinkedIn</Label>
            <Input id="linkedin_connection" name="linkedin_connection" value={client?.linkedin_connection || ""} />
          </div>

          <div class="space-y-2">
            <Label for="related_name">Related Name</Label>
            <Input id="related_name" name="related_name" value={client?.related_name || ""} />
          </div>

          <div class="space-y-2">
            <Label for="first_contact">First Contact Date</Label>
            <Input id="first_contact" name="first_contact" type="date" value={client?.first_contact || ""} />
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div>
        <h3 class="mb-4 font-medium">Additional Information</h3>
        <div class="grid gap-4">
          <div class="space-y-2">
            <Label for="comments">Comments</Label>
            <textarea
              id="comments"
              name="comments"
              rows="3"
              class="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >{client?.comments || ""}</textarea
            >
          </div>

          <div class="space-y-2">
            <Label for="description_contact">Contact Description</Label>
            <Input id="description_contact" name="description_contact" value={client?.description_contact || ""} />
          </div>

          <div class="space-y-2">
            <Label for="description_contact_more">Additional Contact Notes</Label>
            <Input
              id="description_contact_more"
              name="description_contact_more"
              value={client?.description_contact_more || ""}
            />
          </div>

          <div class="space-y-2">
            <Label for="follow_up_action">Follow-up Action</Label>
            <Input id="follow_up_action" name="follow_up_action" value={client?.follow_up_action || ""} />
          </div>

          <div class="space-y-2">
            <Label for="new_business">New Business Potential</Label>
            <Input id="new_business" name="new_business" value={client?.new_business || ""} />
          </div>

          <div class="space-y-2">
            <Label for="recommendation">Recommendation</Label>
            <Input id="recommendation" name="recommendation" value={client?.recommendation || ""} />
          </div>
        </div>
      </div>
    </Card.Content>

    <!-- Hidden inputs for contacts data as fallback -->
    {#if contacts.length > 0}
      <input type="hidden" name="contacts" value={JSON.stringify($state.snapshot(contacts))} />
      <input type="hidden" name="contact_count" value={contacts.length.toString()} />
      {#if contacts.find(c => c.is_primary)}
        <input type="hidden" name="primary_contact" value={JSON.stringify($state.snapshot(contacts.find(c => c.is_primary)))} />
      {/if}
    {/if}

    <Card.Footer class="flex justify-between">
      <Button type="button" variant="outline" href="/clients">Cancel</Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitText}
      </Button>
    </Card.Footer>
  </form>
</Card.Root>
