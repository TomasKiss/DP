<template>
  <div class="home">
    <div class="">
      <PrimeMenu/>
    </div>
  <div class="main p-grid p-flex-column">
    <div class="p-col">
      <VueEditor/>
    </div>
    <div class="p-col">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda sapiente, totam natus dolorem dignissimos similique quis eligendi recusandae adipisci vero autem! Molestiae porro quis tenetur nulla illo dicta doloremque doloribus? Explicabo est unde soluta distinctio voluptate ducimus expedita, delectus at voluptatum eveniet eos exercitationem assumenda, in dolorum. Fugiat repellendus recusandae unde sunt corporis quasi quidem aspernatur, consectetur minima maiores numquam odit exercitationem ipsa eum? Praesentium autem blanditiis officiis enim ullam aut, deserunt veritatis quia sed labore, at quod. Quos, quis praesentium enim tenetur explicabo illo cupiditate illum reprehenderit odio, voluptas sed doloribus aspernatur quisquam ut iste placeat fuga nobis voluptatum.</p>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VueEditor from "@/components/VueEditor.vue"
import PrimeMenu from "@/components/PrimeMenu.vue"

export default {
  name: 'Home',
  components: {
    VueEditor,
    PrimeMenu,
  }
}
</script>

<style>
.main{
  margin: 0 10vw;
}
</style>