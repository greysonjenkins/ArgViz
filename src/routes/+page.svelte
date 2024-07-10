<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Canvas from '$lib/components/Canvas.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="app-container">
  <Navbar />
  <div class="main-content">
    <Sidebar />
    <Canvas />
  </div>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
</style>