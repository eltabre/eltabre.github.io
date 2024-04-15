// BlogPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css'; // Your CSS file for styling

const posts = [
  { id: 1, title: "Exploring Project 1", summary: "A deep dive into Project 1", imageUrl: "/path/to/image1.jpg" },
  { id: 2, title: "The Making of Project 2", summary: "Behind the scenes of Project 2", imageUrl: "/path/to/image2.jpg" },
  // ...other posts
];

function BlogPage() {
  return (
    <div className="blog-page" >
      {posts.map((post) => (
        <Link key={post.id} to={`/btc/post-${post.id}`} className="blog-post-preview">
          <img src={post.imageUrl} alt={post.title} className="post-image" />
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
        </Link>
      ))}
    </div>
  );
}

export default BlogPage;
