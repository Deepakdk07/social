import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'

import PostCard from '../Components/PostCard'
import PostForm from '../Components/PostForm'
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
    const { user } = useContext(AuthContext)

  let posts = ''
  const { loading, data } = useQuery(FETCH_POSTS_QUERY)

  console.log(`Loading: ${loading}`)
  console.log(data)

  if (data) {
    posts = { data: data.getPosts }
  }
  return (
    <Grid columns={1} style = {{maxWidth : 400, margin : "auto"}}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      {
          user && (<Grid.Column>
              <PostForm />
          </Grid.Column>)
      }
      {loading ? (
        <h1>Loading posts..</h1>
      ) : (
        posts.data &&
        posts.data.map(post => (
          <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
            <PostCard post={post} />
          </Grid.Column>
        ))
      )}
      <Grid.Row></Grid.Row>
    </Grid>
  )
}



export default Home