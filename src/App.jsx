import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const imagesMock = [
  {
    name: "small cute cat",
    tags: ["cat", "cute", "small"],
    owner: "orhalimi",
  },
  {
    name: "big less cute cat",
    tags: ["cat", "not cute", "big"],
    owner: "orhalimi",
  },
];

function App() {
  const [files, setFiles] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(files);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`images[${i}]`, files[i], files.name);
    }

    formData.append("json", JSON.stringify(imagesMock));
    const res = await axios.post("/aaa", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }

  async function handleChange(event) {
    console.log(event);
    setFiles(event.target.files);
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label for="files">Select files:</label>
        <input
          type="file"
          id="files"
          name="files"
          multiple
          onChange={handleChange}
        />
        <br />
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
