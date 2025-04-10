<template>
  <div>
    <role-form
      role="clients"
      roleFriendlyNameSingular="client"
      roleFriendlyNamePlural="Clients"
      empty-text="There are no clients."
      multiple
    />
    <role-form
      role="passengers"
      roleFriendlyNameSingular="passenger"
      roleFriendlyNamePlural="Passengers"
      empty-text="There are no passengers."
      multiple
    />
  </div>

</template>

<script>
import RoleForm from '@/components/forms/cruise/RoleForm'

export default {
  name: 'ClientsSection',
  components: {
    RoleForm
  }
}
</script>
