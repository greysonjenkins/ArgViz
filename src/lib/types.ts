export interface Atom {
  id: string;
  name: string;
  premise: string;
  truthValue: boolean;
  x: number;
  y: number;
}

export type LogicalConnector = 'AND' | 'OR' | 'NOT' | 'IMPLIES';

export interface Molecule {
  id: string;
  atoms: string[];  // Array of atom IDs
  connector: LogicalConnector;
  truthValue: boolean;
  x: number;
  y: number;
}

export type Node = Atom | Molecule;

export function isAtom(node: Node): node is Atom {
  return 'premise' in node;
}

export function isMolecule(node: Node): node is Molecule {
  return 'atoms' in node;
}