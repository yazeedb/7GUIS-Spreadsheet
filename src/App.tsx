import React, { useReducer } from 'react';
import './App.css';
import { initialColumnValues, initialState, reducer } from './state';

const idToRowIndex = (id: string) => id[0];

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state.cellMap);

  return (
    <main>
      <table>
        <thead>
          <tr>
            <td className="table-spacer" />
            {initialColumnValues.map((_, index) => (
              <td key={index}>{String.fromCharCode(65 + index)}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* {
            state.cellMap.forEach((cell, id) => {
              
            })
          }

          {state.cellMap.forEach((cell, id) => (
            <tr key={key}>
              <td className="row-number">{idToRowIndex(id)}</td>

              {columns.map((cell, columnIndex) => (
                <td
                  key={columnIndex}
                  onClick={() =>
                    dispatch({
                      type: 'EDIT_CELL',
                      rowIndex,
                      columnIndex,
                    })
                  }
                >
                  {cell.computedValue}
                  {cell.isEditing ? 'true' : 'false'}
                </td>
              ))}
            </tr>
          ))} */}
        </tbody>
      </table>
    </main>
  );
}

export default App;
