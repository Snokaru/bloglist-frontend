import React, { useState, useEffect } from "react";
import "./App.css";
import Blog from "./components/Blog";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const submitLoginForm = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username, password
      });

      blogService.setToken(user.token);
      setUser(user);
      setPassword('');
      setUsername('');
    } catch (exception) {
      setMessage("wrong username or password");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000); 
    }
  };

  const addBlog = async (e) => {
    e.preventDefault(); 
    try {
      const newBlog = {
        url,
        title,
        author
      };

      const addedBlog = await blogService.addBlog(newBlog);
      console.log(addedBlog);
      setBlogs(blogs.concat(addedBlog));
      setMessage(`a new blog ${addedBlog.title} ${addedBlog.author} added`);
      setMessageType("success");

    } catch(exception) {
      console.log(exception);
    }
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={submitLoginForm}>
        <div>
          username 
          <input type="text" 
          value={username} 
          name="Username" 
          onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
          password
          <input type="password"
          value={password}
          name="Password"
          onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} is logged in.<button onClick={() => setUser(null)}>log out</button></p>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
      <div>
        title:
        <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />  
      </div> 
      <div>
        author:
        <input type="text" value={author} onChange={(event) => setAuthor(event.target.value)} />  
      </div>
      <div>
        url:
        <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} />  
      </div>
      <button type="submit">create</button>
      </form>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  console.log(message, messageType);
  return (
    <div>
      <div className={messageType}>{message}</div>
      {user === null ? loginForm() : blogList()}
    </div>
  );
};

export default App;
