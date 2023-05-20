import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import M from "materialize-css";

export default function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [userProfile, setProfile] = useState(null);
  const { userid } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);

  // Add function to handle updating the post
  const updatePost = () => {
    if (!title || !body) {
      M.toast({ html: "Please fill in all fields", classes: "red" });
      return;
    }
    fetch(`http://localhost:5000/editpost/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        title,
        body,
        pic: image, // Pass the updated image if needed
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "red" });
        } else {
          M.toast({ html: "Post updated successfully", classes: "green dark" });
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Social-webApp");
    data.append("cloud_name", "dt0isai38");
    fetch("https://api.cloudinary.com/v1_1/dt0isai38/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-feild"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn  #e57373 red lighten-2">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" placeholder="" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #e57373 red lighten-2"
        onClick={() => postDetails()}
      >
        Update Post
      </button>
    </div>
  );
}
