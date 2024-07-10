<script lang="ts">
  import { atoms, molecules, selectedAtoms, logicalConnector, evaluatedMolecules } from '$lib/stores';
  import type { Atom, Molecule, LogicalConnector } from '$lib/types';
  import AtomComponent from './Atom.svelte';
  import MoleculeComponent from './Molecule.svelte';

  let newAtom: Omit<Atom, 'id'> = { name: '', premise: '', truthValue: true, x: 0, y: 0 };

  function addAtom() {
    if (newAtom.name && newAtom.premise) {
      atoms.addAtom(newAtom);
      newAtom = { name: '', premise: '', truthValue: true, x: 0, y: 0 };
    }
  }

  function removeAtom(id: string) {
    atoms.removeAtom(id);
    selectedAtoms.delete(id);
  }

  function removeMolecule(id: string) {
    molecules.removeMolecule(id);
  }

  function createMolecule() {
    if ($selectedAtoms.size < 2 && $logicalConnector !== 'NOT') {
      alert('Please select at least two atoms for AND, OR, or IMPLIES connectors.');
      return;
    }
    if ($selectedAtoms.size !== 1 && $logicalConnector === 'NOT') {
      alert('Please select exactly one atom for the NOT connector.');
      return;
    }

    const selectedAtomIds = Array.from($selectedAtoms);
    const selectedAtomObjects = selectedAtomIds.map(id => $atoms.find(atom => atom.id === id));

    if (selectedAtomObjects.some(atom => atom === undefined)) {
      alert('Error: Some selected atoms not found.');
      return;
    }

    const newMolecule: Omit<Molecule, 'id'> = {
      atoms: selectedAtomIds,
      connector: $logicalConnector,
      truthValue: false, // This will be evaluated in the evaluatedMolecules store
      x: 0,
      y: 0,
    };

    molecules.addMolecule(newMolecule);
    selectedAtoms.clear();
  }
</script>

<div class="sidebar">
  <h2>Dictionary</h2>
  
  <form on:submit|preventDefault={addAtom}>
    <input bind:value={newAtom.name} placeholder="Name" required />
    <input bind:value={newAtom.premise} placeholder="Premise" required />
    <div class="switch-container">
      <label class="switch">
        <input type="checkbox" bind:checked={newAtom.truthValue} />
        <span class="slider round"></span>
      </label>
      <span class="switch-label">{newAtom.truthValue ? 'True' : 'False'}</span>
    </div>
    <button type="submit">Add Atom</button>
  </form>

  <div class="section">
    <h3>Atoms</h3>
    <div class="item-container">
      {#each $atoms as atom (atom.id)}
        <AtomComponent 
          {atom} 
          isSelected={$selectedAtoms.has(atom.id)}
          on:select={() => selectedAtoms.toggle(atom.id)}
          on:remove={() => removeAtom(atom.id)}
        />
      {/each}
    </div>
  </div>

  <div class="section">
    <h3>Molecules</h3>
    <div class="item-container">
      {#each $evaluatedMolecules as molecule (molecule.id)}
        <MoleculeComponent 
          {molecule} 
          on:remove={() => removeMolecule(molecule.id)}
        />
      {/each}
    </div>
  </div>

  <div class="controls">
    <select bind:value={$logicalConnector}>
      <option value="AND">AND</option>
      <option value="OR">OR</option>
      <option value="NOT">NOT</option>
      <option value="IMPLIES">IMPLIES</option>
    </select>
    <button on:click={createMolecule}>Create Molecule</button>
  </div>
</div>

<style>
  .sidebar {
    width: 250px;
    height: 100%;
    background-color: #2a2a2a;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h2, h3 {
    margin-bottom: 0.5rem;
    color: #ffffff;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section {
    border-top: 1px solid #444;
    padding-top: 1rem;
  }

  .item-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .switch-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .switch-label {
    font-size: 1rem;
    line-height: 34px;
  }
</style>