<template lang="">
    <h2>404 page not found</h2>
    <router-link :to="{ name: 'Home' }"><Button>Back to main page</Button></router-link>
</template>
<script>
import Button from 'primevue/button';
export default {
    components:{Button},
};
</script>
<style lang="">
</style>