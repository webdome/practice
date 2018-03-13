<template>
  <div>
    code detail
  </div>
</template>
<script>
export default {
  validate ({ params }) {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/.test(params.id)
  }
}
</script>
