<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import type { ContactResponse } from "$lib/types";
    import Edit from "@lucide/svelte/icons/edit";
    import Trash from "@lucide/svelte/icons/trash-2";
    import Mail from "@lucide/svelte/icons/mail";
    import Phone from "@lucide/svelte/icons/phone";
    import User from "@lucide/svelte/icons/user";
  
    // Props
    const { 
      contacts = [],
      editable = false,
      onEdit,
      onDelete
    }: {
      contacts: ContactResponse[];
      editable?: boolean;
      onEdit?: (contact: ContactResponse) => void;
      onDelete?: (contact: ContactResponse) => void;
    } = $props();
  </script>
  
  {#if contacts.length === 0}
    <div class="rounded-md border border-dashed p-6 text-center">
      <User class="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 class="mt-2 text-sm font-semibold">No contacts</h3>
      <p class="mt-1 text-sm text-muted-foreground">
        {editable ? "Add a contact to get started." : "No contacts have been added yet."}
      </p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each contacts as contact (contact.id)}
        <Card.Root class="relative">
          <Card.Content class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 space-y-2">
                <!-- Name and Primary Badge -->
                <div class="flex items-center gap-2">
                  <h4 class="font-semibold">
                    {contact.first_name} {contact.last_name}
                  </h4>
                  {#if contact.is_primary}
                    <Badge variant="secondary" class="text-xs">Primary</Badge>
                  {/if}
                </div>
  
                <!-- Position -->
                {#if contact.position}
                  <p class="text-sm text-muted-foreground">{contact.position}</p>
                {/if}
  
                <!-- Contact Info -->
                <div class="flex flex-wrap gap-4 text-sm">
                  {#if contact.email}
                    <div class="flex items-center gap-1">
                      <Mail class="h-3 w-3 text-muted-foreground" />
                      <a 
                        href={`mailto:${contact.email}`} 
                        class="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  {/if}
                  
                  {#if contact.phone}
                    <div class="flex items-center gap-1">
                      <Phone class="h-3 w-3 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                  {/if}
                </div>
              </div>
  
              <!-- Actions -->
              {#if editable}
                <div class="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-8 w-8"
                    onclick={() => onEdit?.(contact)}
                  >
                    <Edit class="h-3 w-3" />
                    <span class="sr-only">Edit contact</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-8 w-8 text-destructive hover:text-destructive"
                    onclick={() => onDelete?.(contact)}
                  >
                    <Trash class="h-3 w-3" />
                    <span class="sr-only">Delete contact</span>
                  </Button>
                </div>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {/if} 