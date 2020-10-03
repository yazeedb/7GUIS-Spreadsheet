import React, { useReducer } from 'react';
import './App.css';
import { initialState, reducer } from './state';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <main>
      <table>
        <thead>
          <tr>
            <td className="table-spacer" />
            {state.rows[0].map((_, index) => (
              <td key={index}>{String.fromCharCode(65 + index)}</td>
            ))}
          </tr>
        </thead>

        <tbody>
          {state.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="row-number">{rowIndex}</td>

              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  onClick={() => {
                    dispatch({
                      type: 'EDIT_CELL',
                      rowIndex,
                      cellIndex,
                    });
                  }}
                >
                  {cell.isEditing ? (
                    <input
                      defaultValue={cell.computedValue}
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          dispatch({
                            type: 'STOP_EDIT_CELL',
                            rowIndex,
                            cellIndex,
                          });
                        } else if (event.key === 'Enter') {
                          dispatch({
                            type: 'UPDATE_CELL',
                            rowIndex,
                            cellIndex,
                            value: event.currentTarget.value,
                          });

                          dispatch({
                            type: 'STOP_EDIT_CELL',
                            rowIndex,
                            cellIndex,
                          });
                        }
                      }}
                    />
                  ) : (
                    cell.computedValue
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
