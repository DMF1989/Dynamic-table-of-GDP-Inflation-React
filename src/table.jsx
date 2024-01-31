import React, { useState, useEffect, useRef} from 'react';
import initialData from './InitialData'
import {EditableIndex, EditableCell, EditableYear, EditableCategory } from './EditableInput'

function App() {
  const [data, setData] = useState(initialData);
  const [bienNames, setBienNames] = useState([]);
  const [sum, setSum] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [growthIPC, setGrowthIPC] = useState([]);
  const [hasOnClick, setHasOnClick] = useState(true);
  const [H3, setH3] = useState([]);
  const signP = useRef('-');
  const signS = useRef('-');

/*   var cat = data.map(item => {return item.categories[2].category}) */
/* for (let i = 0; i < data[0].categories.length; i++) {
  console.log(data[0].categories[i].valores)
} */
/* console.log(data[0].categories.length) */

let arreglo = new Array (data[0].categories[0].valores.length);
arreglo.fill('')
var PriceIndex = data[0].categories.length-1;
var SellIndex = PriceIndex-1
/* console.log(data[0].categories[PriceIndex-1].category) */

  useEffect(() => {
    const formElements = Array.from(document.querySelectorAll('input'));
    formElements.forEach((element, index) => {
      const uniqueName = `name_${index}_${Math.random().toString(36).substr(2, 9)}`;
      if(!element.getAttribute('name')) {element.setAttribute('name', uniqueName)};
    });
  }, [data]);

  const handleEdit = (yearIndex, rowIndex, colIndex, newValue) => {
    const newData = [...data];
    newData[yearIndex].categories[rowIndex].valores[colIndex] = Number(newValue);
    setData(newData);
  };

  const handleEditYear = (yearIndex, newValue) => {
    const newData = [...data];
    newData[yearIndex].year = Number(newValue);
    setData(newData);
  };

  const handleEditCategory = (yearIndex, rowIndex, newValue) => {const newData = [...data]; newData[yearIndex].categories[rowIndex].category = newValue; setData(newData); };

  const handleAddColumn = () => {
    const newData = data.map(year => {
      const newCategories = year.categories.map(row => {
        const newvalores = [...row.valores, ''];
        return { ...row, valores: newvalores };
      });
      return { ...year, categories: newCategories };
    });
  
    if (bienNames.length > 0) {
      const lastBienName = bienNames[bienNames.length - 1];
      // Usamos una expresión regular para encontrar el número en cualquier parte de la cadena
      const match = lastBienName.match(/(\d+)/);
      let newBienName;
      if (match) {
        // Incrementamos el número en uno y lo reemplazamos en la cadena original
        const newNumber = parseInt(match[0]) + 1;
        newBienName = lastBienName.replace(match[0], newNumber);
      } else {
        // Si no hay un número, buscamos una letra mayúscula al final de la cadena
        const letterMatch = lastBienName.match(/(\s[A-Z])$/);
        if (letterMatch) {
          // Obtenemos la letra mayúscula, la convertimos a su código ASCII, le sumamos uno y la convertimos de nuevo a una letra
          const newLetter = String.fromCharCode(letterMatch[0].trim().charCodeAt(0) + 1);
          newBienName = lastBienName.replace(letterMatch[0], ` ${newLetter}`);
        } else {
          // Manejar el caso en que no se encuentre un número ni una letra mayúscula al final de la cadena
        }
      }
      if (newBienName) {
        const newBienNames = [...bienNames, newBienName];
        setBienNames(newBienNames);
      }
    } else {
      // Manejar el caso en que bienNames esté vacío
    }
    setData(newData);
  };
  
  const handleEditBien = (index, newValue) => {
    // Copiamos el estado actual
    const newBienNames = [...bienNames];
    // Cambiamos el nombre del bien en el índice dado
    newBienNames[index] = newValue;
    // Actualizamos el estado con el nuevo array
    setBienNames(newBienNames);
  };

  const handleRemoveColumn = () => {
    if (bienNames.length > 0)
    {bienNames.length = bienNames.length - 1};
    if (data[0].categories[0].valores.length > 1) {
      const newData = data.map(year => {
        const newCategories = year.categories.map(row => {
          const newvalores = [...row.valores];
          newvalores.pop();
          return { ...row, valores: newvalores };
        });
        return { ...year, categories: newCategories };
      });
      setData(newData);
    }
  };

  const handleAddYear = () => {
    const newYear = data[data.length - 1].year + 1;
  const newCategories = data[data.length-1].categories.map(category => ({
    category: category.category,
    valores: category.valores.map(() => '')
  }));
  const newData = [...data, { year: newYear, categories: newCategories }];
      console.log(newData)
    setData(newData);
  };

  const handleRemoveYear = () => {
    if (data.length > 1) {
      const newData = [...data];
      newData.pop();
      setData(newData);
    }
  };

// Crear una nueva constante que elimine o agregue el primer elemento del array de categorías de cada año
const handleRemoveOrAddFirstRow = () => {
  const newData = data.map(year => {
    // Crear una copia del array de categorías para no modificar el original
    const copiaCategorias = [...year.categories];
    // Si el array de categorías tiene tres elementos, eliminar el primero usando el operador ...
    if (copiaCategorias.length === 3) {
      copiaCategorias.splice(0, 1); signP.current = '+'; setHasOnClick(false);
      return { ...year, categories: copiaCategorias };
    }
    // Si el array de categorías tiene dos elementos, agregar uno al principio con el valor de "Producción" usando el método unshift
    if (copiaCategorias.length === 2) {
      copiaCategorias.unshift({ category: "Producción", valores: arreglo }); signP.current = '-'; setHasOnClick(true); 
      return { ...year, categories: copiaCategorias };
    }
    // Si el array de categorías tiene otro número de elementos, devolver el año sin cambios
    return year;
  });
  setData(newData);
};

// Crear una nueva constante que elimine o agregue el segundo elemento del array de categorías de cada año
const handleRemoveOrAddSecondRow = () => {
  const newData = data.map(year => {
    // Crear una copia del array de categorías para no modificar el original
    const copiaCategorias = [...year.categories];
    // Si el array de categorías tiene tres elementos, eliminar el segundo usando el método splice
    if (copiaCategorias.length === 3) {
      copiaCategorias.splice(1, 1); signS.current = '+';
      return { ...year, categories: copiaCategorias };
    }
    // Si el array de categorías tiene dos elementos, agregar uno en la segunda posición con el valor de "Precio" usando el método splice
    if (copiaCategorias.length === 2) {
      copiaCategorias.splice(1, 0, { category: "Ventas", valores: arreglo }); signS.current = '+';
      return { ...year, categories: copiaCategorias };
    }
    // Si el array de categorías tiene otro número de elementos, devolver el año sin cambios
    return year;
  });
  setData(newData);
};

const baseYear = data[0];
const baseSellRow = baseYear.categories[SellIndex];
const basePriceRow = baseYear.categories[PriceIndex];

useEffect(() => {
 var div = document.getElementsByTagName("div")[5];
 var H3length = document.getElementsByTagName("H3").length;
  H3length === 4 || H3length === 5 ? div.style.justifyContent = 'center' : div.style.justifyContent = 'space-evenly';
}, [sum]);

const calculateSumAndGrowth = () => {
  setH3(['PIB Nominal', 'PIB Real', 'PIB Inflación', 'Deflactor', 'Inflación (deflactor)', 'Índice de precios al consumidor', 'Inflación', 'Deflactor', 
  'Inflación (deflactor)']
  // Mapea los elementos a elementos h3 con el atributo title
  .map((item, index) => {
    // Crea un arreglo con los valores de los titles
    const titles = ['ΔPIB(N) – ΔPIB(R)', 'ΔPIB(N) / ΔPIB(R)', 'DEFn - DEFn - 1', "(∑PtQ0 / ∑P0Q0) · 100", "(IPCt – IPC0) / IPC0", "(∑PtQt / ∑P0Qt) · 100", 
    "(Deflactor - 100) / 100"];
    // Usa una expresión ternaria anidada para condicionar el retorno del elemento
if (signP.current === "+") {
  if (index >= 5 && index <= 8) {
    return <h3 key={index} title={titles[index - 2]} style= {{color: 'dodgerblue'}}>{item}</h3>;
  } else {
    return null;
  }
} else if (signS.current === "+") {
  if (index >= 0 && index <= 4) {
    return <h3 key={index} title={titles[index - 2]} style= {{color: 'lightseagreen'}}>{item}</h3>;
  } else {
    return null;
  }
} else {
  if (index >= 0) {
    return <h3 key={index} title={titles[index - 2]} style={{color: index >= 0 && index < 5? "lightseagreen" : index >= 5 ? "dodgerblue" : "orange"}}>{item}</h3>;
  } else {
    return <h3 key={index}>{item}</h3>;
  }
}
  }));

  if (signP.current === '-') {calculatePIB()
  } else {
    setSum([]);
    setGrowth([]);
  };
  
  if (signS.current === '-') {calculateIPC()
  } else {
    setGrowthIPC([]);
  };
};

  const calculatePIB = () => {    
  const newSums = data.map(year => {
  const productionRow = year.categories[0];
  const priceRow = year.categories[PriceIndex];
  const nominalYearSum = productionRow && priceRow && basePriceRow ? productionRow.valores.reduce((acc, value, index) => acc + value * priceRow.valores[index], 0) : 0;
  const realYearSum = productionRow && priceRow && basePriceRow ? productionRow.valores.reduce((acc, value, index) => acc + value * basePriceRow.valores[index], 0) : 0;
  return { ...year, nominalSum: nominalYearSum, realSum: realYearSum };
});

    const deflactors = [100];
    const newGrowth = newSums.map((yearSum, index) => {
      if (index === 0) {
        return { year: yearSum.year, nominalGrowth: null, realGrowth: null, inflation: null, deflactor: null, deflactorChange: null};
      } else {
        const previousYearSum = newSums[index - 1] || { deflactor: 100 };
        const nominalGrowth = ((yearSum.nominalSum - previousYearSum.nominalSum) / previousYearSum.nominalSum).toFixed(4)*100;
        const realGrowth = ((yearSum.realSum - previousYearSum.realSum) / previousYearSum.realSum).toFixed(4)*100;
        const inflation = nominalGrowth - realGrowth;
        const deflactor = ((yearSum.nominalSum / yearSum.realSum)*100).toFixed(2);
        deflactors.push(deflactor);
        const deflactorChange = index > 0 ? ((deflactor - deflactors[index - 1]) / deflactors[index - 1]).toFixed(4)*100 : null;
        return { year: yearSum.year, nominalGrowth: nominalGrowth, realGrowth: realGrowth, inflation: inflation, deflactor: deflactor, deflactorChange: deflactorChange };
      }
    });
    setSum(newSums);
    setGrowth(newGrowth);
  }
  
  const calculateIPC = () => {
    const newSumsIPC = data.map(year => {
      const sellRow = year.categories[SellIndex];
      const priceRow = year.categories[PriceIndex];
      const VxP = priceRow && baseSellRow ? priceRow.valores.reduce((acc, value, index) => acc + value * baseSellRow.valores[index], 0) : 0;
      const VxPt = sellRow && priceRow ? sellRow.valores.reduce((acc, value, index) => acc + value * priceRow.valores[index], 0) : 0;
      const PxV = sellRow && basePriceRow ? sellRow.valores.reduce((acc, value, index) => acc + value * basePriceRow.valores[index], 0) : 0;
      return { ...year, SxP: VxP, PxS: PxV, VxPt: VxPt, PxV: PxV};
    });
    
        const newGrowthIPC = newSumsIPC.map((yearSum, index) => {
          if (index === 0) {
            return { IPC: null};
          } else {
            const baseYearSum = newSumsIPC[0] || { deflactor: 100 };
            const IPC = (yearSum.SxP / baseYearSum.SxP*100).toFixed(4);
            const IPCpc = (yearSum.SxP / baseYearSum.SxP*100-100).toFixed(4);
            const ipcDef = (yearSum.VxPt / yearSum.PxV*100).toFixed(4);
            const ipcDefpc = (yearSum.VxPt / yearSum.PxV*100-100).toFixed(4);
            return { ipc: IPC, ipcpc: IPCpc, ipcDef: ipcDef, ipcDefpc: ipcDefpc };
          }
        });
        setGrowthIPC(newGrowthIPC);
  }
  
  return (
    <div>
        <table>
          <thead>
            <tr>
              <th>Año</th>
              <th>Categoría</th>
              {data[0].categories[PriceIndex].valores.map((_, i) => (<th key={i}>
              <EditableIndex value={bienNames[i] || `Bien ${i + 1}`} // Si no hay un nombre definido, usamos el valor por defecto
                  onChange={(newValue) => handleEditBien(i, newValue)} // Pasamos la función que cambia el nombre
                />
            </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((year, yearIndex) => (
              <React.Fragment key={yearIndex}>
                {year.categories.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{borderBottom: rowIndex === PriceIndex? '1px solid black' : ''}}>
                    {rowIndex === 0 && <td className='year' rowSpan={year.categories.length}>
                      <EditableYear value={year.year} onChange={newValue => handleEditYear(yearIndex, newValue)} /></td>}
                    <td className='category'>
                      <EditableCategory value={row.category} onChange={newValue => handleEditCategory(yearIndex, rowIndex, newValue)} />
                      </td>
                    {row.valores.map((value, colIndex) => (
                      <td key={colIndex}>
                        <EditableCell value={value} onChange={newValue => handleEdit(yearIndex, rowIndex, colIndex, newValue)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      <div>
        <button onClick={handleAddColumn}>+</button>
        <button onClick={handleRemoveColumn}>-</button>
      </div>
      <div>
        <button onClick={handleAddYear}>+ Año</button>
        <button onClick={handleRemoveYear}>- Año</button>
      </div>
      <div>
        <button onClick={handleRemoveOrAddFirstRow}> {signP.current} Producción</button>
        {hasOnClick ? (
      // Si el estado es verdadero, renderizar el elemento con el prop onClick
      <button onClick={handleRemoveOrAddSecondRow}> {signS.current} Ventas</button>
    ) : (
      // Si el estado es falso, renderizar el elemento sin el prop onClick
      <button> {signS.current} Ventas</button>
    )}
      </div>
      <button onClick={calculateSumAndGrowth}>Calcular</button>
      <div>
<span>
{H3[0]}
{sum.map((yearSum, index) => (
  <p key={index}>PIB {yearSum.year}: {yearSum.nominalSum}</p>
))}
{growth.map((yearGrowth, index) => (
  yearGrowth.nominalGrowth !== null && <React.Fragment key={index}><p>Δ{yearGrowth.year}: {yearGrowth.nominalGrowth} %</p></React.Fragment>
))}
{H3[1]}
{sum.map((yearSum, index) => (
  <React.Fragment key={index}><p>PIB {yearSum.year}: {yearSum.realSum}</p></React.Fragment>
))}
{growth.map((yearGrowth, index) => (
  yearGrowth.realGrowth !== null && <React.Fragment key={index}><p>Δ{yearGrowth.year}: {yearGrowth.realGrowth} %</p></React.Fragment>
))}
{H3[2]}
{growth.map((yearGrowth, index) => (
 yearGrowth.inflation !== null && <React.Fragment key={index}><p>Δ{yearGrowth.year}: {yearGrowth.inflation} %</p></React.Fragment>
))}
{H3[3]}
{growth.map((yearGrowth, index) => (
 yearGrowth.deflactor !== null && <React.Fragment key={index}><p>Δ{yearGrowth.year}: {yearGrowth.deflactor} %</p></React.Fragment>
))}
{H3[4]}
{growth.map((yearGrowth, index) => (
 yearGrowth.deflactorChange !== null && <React.Fragment key={index}><p>Δ{yearGrowth.year}: {yearGrowth.deflactorChange} %</p></React.Fragment>
))}
</span>
<span>
{H3[5]}
{growthIPC.map((yearGrowth, index) => (
 yearGrowth.IPC !== null && <React.Fragment key={index}><p>IPC {yearGrowth.year}: {yearGrowth.ipc}</p></React.Fragment>
))}
{H3[6]}
{growthIPC.map((yearGrowth, index) => (
 yearGrowth.IPC !== null && <React.Fragment key={index}><p>π {yearGrowth.year}: {yearGrowth.ipcpc} %</p></React.Fragment>
))}
{H3[7]}
{growthIPC.map((yearGrowth, index) => (
 yearGrowth.IPC !== null && <React.Fragment key={index}><p>DEF {yearGrowth.year}: {yearGrowth.ipcDef}</p></React.Fragment>
))}
{H3[8]}
{growthIPC.map((yearGrowth, index) => (
 yearGrowth.IPC !== null && <React.Fragment key={index}><p>π {yearGrowth.year}: {yearGrowth.ipcDefpc} %</p></React.Fragment>
))}
</span>
      </div>
    </div>
  );
}

export default App;
