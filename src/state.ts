type ComputedValue = string | number;

interface Cell {
  rawValue: string;
  computedValue: ComputedValue;
  isEditing: boolean;
}

interface State {
  cellMap: Map<string, Cell>;
}

export type Action =
  | {
      type: 'EDIT_CELL';
      rowIndex: number;
      columnIndex: number;
    }
  | {
      type: 'STOP_EDIT_CELL';
      rowIndex: number;
      columnIndex: number;
    };

export const initialColumnValues: Cell[] = Array.from({ length: 26 }, () => ({
  rawValue: '',
  computedValue: '',
  isEditing: false,
}));

export const initialState: State = {
  cellMap: Array.from({ length: 100 }, () => initialColumnValues).reduce(
    (map, row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        map.set(`${rowIndex},${columnIndex}`, cell);
      });

      return map;
    },
    new Map()
  ),
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'EDIT_CELL': {
      const { columnIndex, rowIndex } = action;
      const id = `${rowIndex},${columnIndex}`;

      const cell = state.cellMap.get(id);

      if (cell) {
        state.cellMap.set(id, { ...cell, isEditing: true });
      }

      return state;
    }

    case 'STOP_EDIT_CELL': {
      const { columnIndex, rowIndex } = action;
      const id = `${rowIndex},${columnIndex}`;

      const cell = state.cellMap.get(id);

      if (cell) {
        state.cellMap.set(id, { ...cell, isEditing: false });
      }

      return state;
    }
  }
};
