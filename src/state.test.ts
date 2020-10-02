import { Action, initialState, reducer } from './state';

describe('state', () => {
  it('can edit cells', () => {
    const result = reducer(initialState, {
      type: 'EDIT_CELL',
      rowIndex: 1,
      columnIndex: 2,
    });

    expect(result.cellMap.get('1,2')).toEqual({
      rawValue: '',
      computedValue: '',
      isEditing: true,
    });
  });

  it('can stop editing cells', () => {
    const actions: Action[] = [
      { type: 'EDIT_CELL', rowIndex: 1, columnIndex: 2 },
      { type: 'STOP_EDIT_CELL', rowIndex: 1, columnIndex: 2 },
    ];

    const result = actions.reduce(reducer, initialState);

    expect(result.cellMap.get('1,2')).toEqual({
      rawValue: '',
      computedValue: '',
      isEditing: false,
    });
  });
});
