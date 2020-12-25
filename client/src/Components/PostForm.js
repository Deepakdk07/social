import gql from 'graphql-tag';
import React from 'react'
import { Button, Form, TextArea } from 'semantic-ui-react'
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
        
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){
            const data = proxy.readQuery({
                query : FETCH_POSTS_QUERY
            })
            data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({ query : FETCH_POSTS_QUERY, data})
            values.body = '';
            console.log(error)
        }
    })
    function createPostCallback(){
        createPost()
    }

    return (
        <div>
        <Form onSubmit = { onSubmit }>
            <h2>Create a Post : </h2>
            <Form.Field>

                <TextArea rows={4} placeholder = "Write Something"
                name = "body"
                onChange = {onChange}
                value = {values.body} 
                style ={{marginBottom :20}}

                />
                <Button type ="submit" color = "teal">
                    Submit
                </Button>
            </Form.Field>
        </Form>
            
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body : String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm
