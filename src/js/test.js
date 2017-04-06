import React from 'react'
import CommentBox from './components/CommentBox'

const data = [
  {author: 'Jordan Walke', text: 'This is *another* comment'}
];

React.render(
  <CommentBox data={data} />,
  document.getElementById('container')
);