<template>
  <div class="accordion-item">
  <div class=" accordion-header" id="headingError">
<button class="btn btn-warning btn-sm w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
  {{ error.message }}</button></div>
      <div class="accordion-collapse collapse" aria-labelledby="headingError" data-bs-parent="#errorAccordion" id="collapseOne">
        <div class="alert alert-warning">
        {{ error.stack }} </div></div>
    </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: {
    error: Error
  }
}
</script>
