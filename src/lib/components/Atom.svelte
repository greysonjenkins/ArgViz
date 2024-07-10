<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Atom } from '$lib/types';

  export let atom: Atom;
  export let isOnCanvas = false;
  export let isSelected = false;

  const dispatch = createEventDispatcher();

  function onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('application/json', JSON.stringify(atom));
    dispatch('dragstart', { event, atom });
  }

  function onClick() {
    dispatch('select', { id: atom.id });
  }
</script>

<div 
  class="atom {isOnCanvas ? 'on-canvas' : ''} {isSelected ? 'selected' : ''}"
  draggable="true"
  on:dragstart={onDragStart}
  on:click={onClick}
  style={isOnCanvas ? `left: ${atom.x}px; top: ${atom.y}px;` : ''}
>
  <div class="atom-name">{atom.name}</div>
  <div class="atom-truth">{atom.truthValue ? 'T' : 'F'}</div>
  {#if isOnCanvas}
    <button class="remove-btn" on:click|stopPropagation={() => dispatch('remove', { id: atom.id })}>×</button>
  {/if}
</div>

<style>
  .atom {
    width: 80px;
    height: 80px;
    border: 2px solid #4a4a4a;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: #2a2a2a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: move;
    position: relative;
    user-select: none;
  }

  .on-canvas {
    position: absolute;
  }

  .selected {
    border-color: #4CAF50;
  }

  .atom-name {
    font-weight: bold;
    text-align: center;
  }

  .atom-truth {
    text-align: center;
    margin-top: 0.25rem;
  }

  .remove-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 1.2em;
  }

  .remove-btn:hover {
    color: #fff;
  }
</style>