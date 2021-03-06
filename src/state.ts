import { computeValue } from './computeValue.naive';

type ComputedValue = string | number;
interface Cell {
  rawValue: string;
  computedValue: ComputedValue;
  isEditing: boolean;
  toString: () => string;
}

type Rows = Cell[][];

interface State {
  rows: Rows;
  currentlyEditingCell: Cell | null;
}

type Action =
  | { type: 'EDIT_CELL'; rowIndex: number; cellIndex: number }
  | { type: 'STOP_EDIT_CELL'; rowIndex: number; cellIndex: number }
  | {
      type: 'UPDATE_CELL';
      rowIndex: number;
      cellIndex: number;
      value: string;
    };

const rows = Array.from({ length: 100 }, (_, rowIndex) =>
  Array.from(
    { length: 26 },
    (_, cellIndex) =>
      ({
        rawValue: '',
        computedValue: '',
        isEditing: false,
        toString: () => `${rowIndex},${cellIndex}`,
      } as Cell)
  )
);

export const initialState: State = {
  rows,
  currentlyEditingCell: null,
};

export const reducer = (state: State, action: Action): State => {
  const { rowIndex, cellIndex } = action;
  const cell = state.rows[rowIndex][cellIndex];

  if (!cell) {
    return state;
  }

  switch (action.type) {
    case 'EDIT_CELL': {
      if (state.currentlyEditingCell) {
        state.currentlyEditingCell.isEditing = false;
      }

      cell.isEditing = true;

      return { ...state, currentlyEditingCell: cell };
    }

    case 'STOP_EDIT_CELL': {
      cell.isEditing = false;

      return { ...state, currentlyEditingCell: null };
    }

    case 'UPDATE_CELL': {
      cell.rawValue = action.value.trim();

      cell.computedValue = computeValue(cell.rawValue);

      return { ...state };
    }
  }
};
