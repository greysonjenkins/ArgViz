import { writable, derived } from 'svelte/store';
import type { Atom, Molecule, LogicalConnector } from '$lib/types';

function createAtomStore() {
  const { subscribe, set, update } = writable<Atom[]>([]);

  return {
    subscribe,
    addAtom: (atom: Omit<Atom, 'id'>) => update(atoms => {
      const newAtom = { ...atom, id: Date.now().toString() };
      return [...atoms, newAtom];
    }),
    removeAtom: (id: string) => update(atoms => atoms.filter(atom => atom.id !== id)),
    updateAtom: (id: string, updates: Partial<Atom>) => update(atoms =>
      atoms.map(atom => atom.id === id ? { ...atom, ...updates } : atom)
    ),
    updatePosition: (id: string, x: number, y: number) => update(atoms =>
      atoms.map(atom => atom.id === id ? { ...atom, x, y } : atom)
    ),
    reset: () => set([])
  };
}

function createMoleculeStore() {
  const { subscribe, set, update } = writable<Molecule[]>([]);

  return {
    subscribe,
    addMolecule: (molecule: Omit<Molecule, 'id'>) => update(molecules => {
      const newMolecule = { ...molecule, id: Date.now().toString() };
      return [...molecules, newMolecule];
    }),
    removeMolecule: (id: string) => update(molecules => molecules.filter(m => m.id !== id)),
    updateMolecule: (id: string, updates: Partial<Molecule>) => update(molecules =>
      molecules.map(m => m.id === id ? { ...m, ...updates } : m)
    ),
    updatePosition: (id: string, x: number, y: number) => update(molecules =>
      molecules.map(m => m.id === id ? { ...m, x, y } : m)
    ),
    reset: () => set([])
  };
}

function createSelectedAtomsStore() {
  const { subscribe, update, set } = writable(new Set<string>());

  return {
    subscribe,
    add: (id: string) => update(set => new Set(set.add(id))),
    delete: (id: string) => update(set => {
      set.delete(id);
      return new Set(set);
    }),
    toggle: (id: string) => update(set => {
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return new Set(set);
    }),
    clear: () => set(new Set())
  };
}

export const atoms = createAtomStore();
export const molecules = createMoleculeStore();
export const selectedAtoms = createSelectedAtomsStore();
export const logicalConnector = writable<LogicalConnector>('AND');

// Derived store for all nodes (atoms + molecules)
export const allNodes = derived(
  [atoms, molecules],
  ([$atoms, $molecules]) => [...$atoms, ...$molecules]
);

// Helper function to evaluate truth value of a molecule
function evaluateMoleculeTruthValue(molecule: Molecule, atomStore: Atom[]): boolean {
  const atomValues = molecule.atoms.map(id => atomStore.find(atom => atom.id === id)?.truthValue || false);
  
  switch (molecule.connector) {
    case 'AND':
      return atomValues.every(value => value);
    case 'OR':
      return atomValues.some(value => value);
    case 'NOT':
      return !atomValues[0];
    case 'IMPLIES':
      return !atomValues[0] || atomValues[1];
    default:
      return false;
  }
}

// Derived store for molecules with updated truth values
export const evaluatedMolecules = derived(
  [atoms, molecules],
  ([$atoms, $molecules]) => {
    return $molecules.map(molecule => ({
      ...molecule,
      truthValue: evaluateMoleculeTruthValue(molecule, $atoms)
    }));
  }
);