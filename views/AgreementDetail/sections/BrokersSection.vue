<template>
  <div>
    <role-form
      role="brokers"
      roleFriendlyNameSingular="broker"
      roleFriendlyNamePlural="Brokers"
      empty-text="There are no brokers"
      multiple
    />
    <role-form
      role="stakeholders"
      roleFriendlyNameSingular="stakeholder"
      roleFriendlyNamePlural="Stakeholders"
      empty-text="There are no stakeholders"
      multiple
    />
  </div>
</template>

<script>
import RoleForm from '@/components/forms/cruise/RoleForm'

export default {
  name: 'BrokersSection',
  components: {
    RoleForm
  }
}
</script>
