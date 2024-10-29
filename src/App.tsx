import '@picocss/pico/css/pico.min.css'
import './App.css'
import { useDocument } from '@automerge/automerge-repo-react-hooks'
import { updateText } from '@automerge/automerge/next'
import * as ar from "@automerge/automerge-repo"
import * as an from "@automerge/automerge/next"
//import { AutomergeUrl, RawString } from '@automerge/automerge-repo'


export interface Property {
  id: an.RawString;
  textvalue: string;
}

type ObjectId = string;

export type Model = {
  objectMap: {[key: string]: Property};
  submodels: ObjectId[];
  lastObjectId: an.Counter;
}


function App({ docUrl }: { docUrl: ar.AutomergeUrl }) {

  const [doc, changeDoc] = useDocument<Model>(docUrl)

  return (
    <>
      <button type="button" onClick={() => {
        changeDoc(d => {
          console.log("D", d);
          console.log("d.lastObjectId", d.lastObjectId);
          console.log("d.submodels", d.submodels);
          console.log("d.objectMap", d.objectMap);
          
          const objectId = d.lastObjectId.increment(1).toString();
          console.log("ObjectId", objectId);

          d.objectMap[objectId] = {
            id: new an.RawString(""),
            textvalue:""
            };

          d.submodels.push(objectId);
        }
          
        );
      }}>
        <b>+</b> New property submodel
      </button>

      <div id='property-list'>

      {doc && doc.submodels?.map((objectId, index) =>
        <div className='task' key={index}>
          <h2>property {index}</h2>
          <input type="text"
            placeholder='id:raw' value={doc.objectMap[objectId].id.toString()}
            onChange={(e) => changeDoc(d => {
              // Use Automerge's updateText for efficient multiplayer edits
              // (as opposed to replacing the whole title on each edit)
              d.objectMap[objectId].id = new ar.RawString(e.target.value);
            })}
            
          />
          
          <input type="text"
            placeholder='string' value={doc.objectMap[objectId].textvalue}
            onChange={(e) => changeDoc(d => {
              // Use Automerge's updateText for efficient multiplayer edits
              // (as opposed to replacing the whole title on each edit)
              updateText(d.objectMap[objectId], ['textvalue'], e.target.value)
            })}
          />

          <button type="button" onClick={() => {
           //I wanna use insert\delete for a fake ordering but they dont support custom interfaces? i think inner methods are must use for sync?
            // TODO: Swapping? 
            changeDoc(d=>{
              // d.submodels[0] = {id:new an.RawString("oi"), textvalue: "oi"}
              
              if (index < d.submodels.length -1) {
                const otherObjectId = d.submodels[index + 1];
                const thatObjectId = d.submodels[index];

                d.submodels[index] = otherObjectId;
                d.submodels[index+1] = thatObjectId;
              }
              
              // const prop = d.submodels[0];

              // console.log("prop is: ", prop);
              // console.log("submodels is: ", d.submodels);
              // an.deleteAt(d.submodels, 0);
              // an.insertAt(d.submodels, 0, prop);
              
              // d.submodels[index] = d.submodels[0];

              // if (index < d.submodels.length - 1) {
                
              
              //   console.log("index is: ", index);
              //   d.submodels[index].id = other.id;
              //   d.submodels[index + 1].id = that.id;
              //   d.submodels[index].textvalue = other.textvalue;
              //   d.submodels[index + 1].textvalue = that.textvalue;

              //   // an.deleteAt(
              //   //   d.submodels,
              //   //   index
              //   // );
              //   // an.insertAt(
              //   //   d.submodels,
              //   //   index + 1,
              //   //   that
              //   // )
              // }
            }
            )
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
