<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Molecule } from '$lib/types';
  import { atoms } from '$lib/stores';

  export let molecule: Molecule;
  export let isOnCanvas = false;

  const dispatch = createEventDispatcher();

  function onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('application/json', JSON.stringify(molecule));
    dispatch('dragstart', { event, molecule });
  }

  function getConnectorSymbol(connector: string): string {
    switch (connector) {
      case 'AND': return '∧';
      case 'OR': return '∨';
      case 'NOT': return '¬';
      case 'IMPLIES': return '→';
      default: return connector;
    }
  }

  $: connectorSymbol = getConnectorSymbol(molecule.connector);
  $: formulaDisplay = molecule.atoms
    .map(id => $atoms.find(atom => atom.id === id)?.name || '')
    .join(` ${connectorSymbol} `);
</script>

<div 
  class="molecule {isOnCanvas ? 'on-canvas' : ''}"
  draggable="true"
  on:dragstart={onDragStart}
  style={isOnCanvas ? `left: ${molecule.x}px; top: ${molecule.y}px;` : ''}
>
  <div class="molecule-content">
    <div class="molecule-formula">{formulaDisplay}</div>
    <div class="molecule-truth">{molecule.truthValue ? 'T' : 'F'}</div>
  </div>
  {#if isOnCanvas}
    <button class="remove-btn" on:click|stopPropagation={() => dispatch('remove', { id: molecule.id })}>×</button>
  {/if}
</div>

<style>
  .molecule {
    width: 120px;
    height: 120px;
    border: 2px solid #4a4a4a;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: #1a1a1a;
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

  .molecule-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .molecule-formula {
    font-weight: bold;
    font-size: 1.2em;
    text-align: center;
  }

  .molecule-truth {
    font-weight: bold;
    font-size: 1.5em;
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