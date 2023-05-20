import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
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

  const followUser = () => {
    fetch("hhttp://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
      });
  };
  const unfollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: { ...prevState.user, followers: newFollower },
          };
        });
      });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <hr />
          <div className="row">
            <div className="col">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "18px 0px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div>
                  <img
                    style={{
                      width: "160px",
                      height: "160px",
                      borderRadius: "80px",
                      marginRight: "50%",
                    }}
                    src={userProfile.user.pic}
                  />
                </div>
              </div>
            </div>
            <div className="col">
              <h4>{userProfile.user.name}</h4>
              <h4>{userProfile.user.email}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} followings</h6>
              </div>
              <button
                className="btn waves-effect waves-light #e57373 red lighten-2"
                onClick={() => followUser()}
              >
                Follow
              </button>{" "}
              &nbsp;
              <button
                className="btn waves-effect waves-light #e57373 red lighten-2"
                onClick={() => unfollowUser()}
              >
                Unfollow
              </button>
            </div>
          </div>
          <hr />
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div>
            <img
              style={{ height: "20%", width: "20%" }}
              src="https://hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
            />
          </div>
        </>
      )}
    </>
  );
}
