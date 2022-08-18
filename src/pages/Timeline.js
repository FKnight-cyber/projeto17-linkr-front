import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";
import TimelineHeader from "../components/TimelineHeader";
import SendPostCard from "../components/SendPostCard";
import PostCard from "../components/PostCard";
import RepostCard from "../components/RepostCard";
import TrendingHashtags from "../components/TrendingHashtags";
import { DebounceInput } from "react-debounce-input";
import SearchBoxMobile from "../components/SearchBoxMobile";

export default function Timeline() {
  const { token, setImage, setName, setToken, control} = useContext(UserContext);
  const [posts, setPosts] = useState("");
  const [reposts, setReposts] = useState("");
  const [trending, setTrending] = useState("");
  const navigate = useNavigate();
  setToken(localStorage.getItem("authToken"));
  const notify = (error) => {
    toast(`❗ ${error}`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    let check = control;
    if (!token) {
      navigate("/");
    }
    if (posts === "") {
      getPosts();
    }
    if (reposts === "" || check !== control) {
      check = control;
      getReposts();
    }
    if (trending === "") {
      getTrending();
    }
  }, [control]);

  async function getPosts() {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/timeline`,
        config
      );
      setPosts(result.data.postsMetadata);
      setImage(result.data.userInfo?.picture);
      setName(result.data.userInfo?.username);
    } catch (e) {
      notify(
        "An error occured while trying to fetch the posts, please refresh the page"
      );
      console.log(e);
    }
  }

  async function getReposts() {
    console.log("tentando repost")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/timeline/reposts`,
        config
      );
      setReposts(result.data);
    } catch (e) {
      notify(
        "An error occured while trying to fetch the posts, please refresh the page"
      );
      console.log(e);
    }
  }

  async function getTrending() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/trending`
      );
      setTrending(result.data);
    } catch (e) {
      notify(
        "An error occured while trying to fetch the trending hashtags, please refresh the page"
      );
      console.log(e);
    }
  }

  function renderPosts() {
    if (posts) {
      const timeline = posts.map(
        ({
          id,
          username,
          picture,
          link,
          body,
          title,
          image,
          description,
          userId,
          like,
          reposts,
          createdAt,
        }) => (
          <PostCard
            key={id}
            name={username}
            profileImage={picture}
            url={link}
            text={body}
            titleUrl={title}
            imageUrl={image}
            descriptionUrl={description}
            likes={like}
            postId={id}
            creatorId={userId}
            setPosts={setPosts}
            getPosts={getPosts}
            getTrending={getTrending}
            reposts={reposts}
            createdAt={createdAt}
          />
        )
      ); 
      if(reposts){
        const timelineReposts = reposts.map(
          ({
            id,
            username,
            picture,
            link,
            body,
            title,
            image,
            description,
            userId,
            like,
            reposts,
            reposter,
            reposterId,
            createdAt
          }) => (
            <RepostCard
              key={id}
              name={username}
              profileImage={picture}
              url={link}
              text={body}
              titleUrl={title}
              imageUrl={image}
              descriptionUrl={description}
              likes={like}
              postId={id}
              creatorId={userId}
              setPosts={setPosts}
              getReposts={getReposts}
              getTrending={getTrending}
              reposts={reposts}
              reposter={reposter}
              reposterId={reposterId}
              createdAt={createdAt}
            />
          )
        );
        const allposts = [...timeline,...timelineReposts];
    
        const sortedPosts = allposts.sort(function(x, y){
          return new Date(x.props.createdAt).getTime() - new Date(y.props.createdAt).getTime();
      });

      return sortedPosts.reverse();
      }
  
      return timeline;
    }
    if (posts === []) return <span>There are no posts yet</span>;
    return <span>Loading...</span>;
  }
  return (
    <Container>
      <TimelineHeader />
      <Content>
        <ContentBody>
          <LeftContent>
            <DebounceInput element={SearchBoxMobile} debounceTimeout={300} />
            <h2>timeline</h2>
            <SendPostCard getPosts={getPosts} getTrending={getTrending} />

            {renderPosts()}
          </LeftContent>
          <RightContent>
            <TrendingHashtags hashtags={trending} />
          </RightContent>
        </ContentBody>
      </Content>
    </Container>
  );
}

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #333333;
  span {
    font-weight: 700;
    font-size: 43px;
    color: white;
  }
`;
export const Content = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1060px) {
    margin-top: 42px;
  }
`;
export const ContentBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
export const LeftContent = styled.div`
  width: 711px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right:25px;

  h2 {
    display: flex;
    justify-content: left;
    width: 100%;
    font-weight: 700;
    font-size: 43px;
    color: white;
    margin-top: 50px;
    margin-bottom: 50px;
    text-align: left;
  }

  @media only screen and (max-width: 1060px) {
    width: 100%;
    h2 {
      margin-top: 70px;
      padding-left: 28px;
    }
    div {
      border-radius: 0;
    }
  }
`;
export const RightContent = styled.div`
  margin-top: ${props => props.userPage===true ? "50px":"141px"};
  width: 301px;
  display: flex;
  flex-direction:column;  
  align-items:flex-end;

  @media only screen and (max-width: 1060px) {
    h2 {
      width: 100%;
      padding-left: 22px;
      margin-right: 0;
    }
  }

  @media only screen and (max-width: 1060px) {
    display: none;
  }
`;
