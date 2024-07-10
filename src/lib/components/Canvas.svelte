<script lang="ts">
  import { atoms, molecules, selectedAtoms, evaluatedMolecules } from '$lib/stores';
  import type { Atom, Molecule } from '$lib/types';
  import AtomComponent from './Atom.svelte';
  import MoleculeComponent from './Molecule.svelte';

  let draggedNode: (Atom | Molecule) | null = null;

  function onDragStart(event: DragEvent, node: Atom | Molecule) {
    draggedNode = node;
    event.dataTransfer?.setData('application/json', JSON.stringify(node));
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (draggedNode) {
      updateNodePosition(draggedNode, x, y);
    } else {
      const nodeData = event.dataTransfer?.getData('application/json');
      if (nodeData) {
        const node = JSON.parse(nodeData);
        updateNodePosition(node, x, y);
      }
    }
    draggedNode = null;
  }

  function updateNodePosition(node: Atom | Molecule, x: number, y: number) {
    if ('premise' in node) {
      atoms.updatePosition(node.id, x, y);
    } else {
      molecules.updatePosition(node.id, x, y);
    }
  }

  function removeNode(node: Atom | Molecule) {
    if ('premise' in node) {
      atoms.removeAtom(node.id);
      selectedAtoms.delete(node.id);
    } else {
      molecules.removeMolecule(node.id);
    }
  }

  function toggleAtomSelection(id: string) {
    selectedAtoms.toggle(id);
  }

  $: allNodes = [...$atoms, ...$evaluatedMolecules];
</script>

<div class="canvas" on:dragover={onDragOver} on:drop={onDrop}>
  {#each allNodes as node (node.id)}
    {#if node.x !== 0 || node.y !== 0}
      {#if 'premise' in node}
        <AtomComponent 
          atom={node} 
          isOnCanvas={true} 
          isSelected={$selectedAtoms.has(node.id)}
          on:select={() => toggleAtomSelection(node.id)}
          on:remove={() => removeNode(node)}
          on:dragstart={(e) => onDragStart(e.detail.event, node)}
        />
      {:else}
        <MoleculeComponent 
          molecule={node}
          isOnCanvas={true}
          on:remove={() => removeNode(node)}
          on:dragstart={(e) => onDragStart(e.detail.event, node)}
        />
      {/if}
    {/if}
  {/each}
</div>

<style>
  .canvas {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #1a1a1a;
    overflow: hidden;
  }
</style>