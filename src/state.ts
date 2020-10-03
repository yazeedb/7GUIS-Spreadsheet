interface Cell {
  rawValue: string;
  computedValue: string | number;
  isEditing: boolean;
  toString: () => string;
}

interface State {
  rows: Cell[][];
  currentlyEditingCell: Cell | null;
}

type Action =
  | { type: 'EDIT_CELL'; row: number; column: number }
  | { type: 'STOP_EDIT_CELL'; row: number; column: number }
  | { type: 'UPDATE_CELL'; row: number; column: number; value: string };

const rows = Array.from({ length: 100 }, (_, rowIndex) =>
  Array.from({ length: 26 }, (_, columnIndex) => ({
    rawValue: '',
    computedValue: '',
    isEditing: false,
    toString: () => `${rowIndex},${columnIndex}`,
  }))
);

export const initialState: State = {
  rows,
  currentlyEditingCell: null,
};

export const reducer = (state: State, action: Action): State => {
  const cell = state.rows[action.row][action.column];

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

      return { ...state };
    }
  }
};
