import { useEffect, useState } from "react";
import { storage } from "../lib/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [url, setUrl] = useState("");
  const [parsedData, setParsedData] = useState(null); // nueva variable de estado

  useEffect(() => {
    selectedFile?.name !== undefined && setSelectedFileName(selectedFile.name);
  }, [selectedFile]);

  const handleSubmit = async () => {
    if (selectedFile === "") return;
    console.log(selectedFile);
    const imageRef = ref(storage, `proyectosals/${selectedFile.name}`);

    try {
      await uploadBytes(imageRef, selectedFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setUrl(url);
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeFile = () => {
    setSelectedFile("");
    setSelectedFileName("");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000?urlFile=" + url);
        const data = await response.json();
        console.log(data);
        //setParsedData(data); // actualizar el estado con los datos analizados
      } catch (error) {
        console.error(error);
      }
    }

    url !== "" && fetchData();
  }, [url]);


  return (
    <div className="App">
      <header className="App-header">
        {selectedFile !== "" ? (
          <div>
            <p>{selectedFileName}</p>
            <button onClick={removeFile}>eliminar archivo seleccionado</button>
          </div>
        ) : (
          <>
            <input
              type="file"
              value={""}
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </>
        )}
        <br />
        <button onClick={handleSubmit} type="submit">
          Subir
        </button>
        {parsedData && ( // mostrar los datos analizados si existen
          <ul>
            {parsedData.audioTrackNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}
