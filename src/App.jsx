import React, { useEffect, useState, useReducer } from "react";
import { GoogleLogin } from "react-google-login";
import { refreshGoogleTokenSetup } from "./utils/auth";
import axios from "axios";
import "./App.css";

const clientId =
  "247689045321-cm5s2rjpqjomdm2u0df1f8304p9j9g4n.apps.googleusercontent.com";

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

const initialState = {
  user: {
    isLogin: false,
    googleID: "",
  },
};

const Store = React.createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload.googleID}`;
      return {
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "SET_GOOGLE_ID":
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload}`;
      return {
        user: {
          ...state.user,
          googleID: action.payload,
        },
      };
    default:
      return state;
  }
};

function App() {
  const [files, setFiles] = useState([]);
  const [storeState, dispatch] = useReducer(reducer, initialState);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(files);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`images[]`, files[i], files.name);
    }

    formData.append("json", JSON.stringify({ meta: imagesMock }));
    const res = await axios.post("http://127.0.0.1:5000/images", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }

  async function handleChange(event) {
    console.log(event);
    setFiles(event.target.files);
  }

  const onSuccess = async (res) => {
    console.log("Login Success: currentUser:", res);
    // alert(
    //   `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    // );
    dispatch({
      type: "SET_USER",
      payload: {
        isLogin: true,
        googleID: res.tokenId,
      },
    });
    refreshGoogleTokenSetup(res, dispatch);
  };

  return (
    <div className="App">
      <Store.Provider value={[storeState, dispatch]}>
        {storeState.user.isLogin ? (
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
        ) : (
          <div>
            <GoogleLogin
              clientId={clientId}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={() => console.log("you failed")}
              cookiePolicy={"single_host_origin"}
              style={{ marginTop: "100px" }}
              isSignedIn={true}
            />
          </div>
        )}
      </Store.Provider>
    </div>
  );
}

export default App;
