import '@picocss/pico/css/pico.min.css'
import './App.css'
import { useDocument } from '@automerge/automerge-repo-react-hooks'
import { updateText } from '@automerge/automerge/next'
import { AutomergeUrl, RawString } from '@automerge/automerge-repo'


export interface properties {
  id: RawString;
  textvalue: string;
}

export interface Model {
  submodels: properties[];
}


function App({ docUrl }: { docUrl: AutomergeUrl }) {

  const [doc, changeDoc] = useDocument<Model>(docUrl)

  return (
    <>
      <button type="button" onClick={() => {
        changeDoc(d =>
          d.submodels.push({
            id: new RawString(""),
            textvalue:""
          })
        );
      }}>
        <b>+</b> New property submodel
      </button>

      <div id='property-list'>

      {doc && doc.submodels?.map(({ id, textvalue }, index) =>
        <div className='task' key={index}>
          <h2>property {index}</h2>
          <input type="text"
            placeholder='id:raw' value={id.toString()}
            onChange={(e) => changeDoc(d => {
              // Use Automerge's updateText for efficient multiplayer edits
              // (as opposed to replacing the whole title on each edit)
              d.submodels[index].id = new RawString(e.target.value);
            })}
            
          />
          
          <input type="text"
            placeholder='string' value={textvalue}
            onChange={(e) => changeDoc(d => {
              // Use Automerge's updateText for efficient multiplayer edits
              // (as opposed to replacing the whole title on each edit)
              updateText(d.submodels[index], ['textvalue'], e.target.value)
            })}
          />

          <button type="button" onClick={() => {
            //I wanna use insert\delete for a fake ordering but they dont support custom interfaces? i think inner methods are must use for sync?
            // TODO: Swapping? 
          }}>
          
          <b>V</b> down
          </button>

        </div>)
      }

      </div>



      <footer>
        <p className="read-the-docs">Powered by Automerge + Vite + React + TypeScript
        </p>
      </footer>
    </>
  )
}

export default App
