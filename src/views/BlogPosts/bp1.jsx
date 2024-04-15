// BlogPost.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
//import './BlogPost.css'; // Your CSS file for styling

function bg1() {
  let { postId } = useParams(); // postId will be something like 'post-1'

  // Fetch the post data based on postId or use static data
  // For now, let's assume static content
  const post = {
    title: "Exploring Project 1",
    content: "<p>This is the detailed content of the post...</p>",
    // Other post details...
  };

  return (
    <div className="Navigation">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {/* Render other post details like images, videos, etc. */}
    </div>
  );
}

export default bg1;
