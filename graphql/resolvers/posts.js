const { AuthenticationError, UserInputError } =require('apollo-server');

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth');
module.exports = {
    Query: {
        async getPosts(){
             try{
                 const posts = await Post.find().sort({ createdAt: -1 });
                 return posts;
             }catch(err){
                 throw new Error(err);
             }
         },
         async getPost(_, { postId }){
             try { 
                 const post = await Post.findById(postId);
                 if(post){
                     return post;
                 }else{
                     throw new Error('Post not found');
                 }
             }
             catch(err){
                 throw new Error(err);
             }
         }
     },
     Mutation: {
         async createPost(_, { body }, context){
            const user = checkAuth(context);
           
            if(body.trim() === ''){
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({
                body,
                user:user.id,
                username: user.username,
                createdAt: new Date().toLocaleString()

            });
            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;

         },
         async deletePost(_, { postId }, context){
             const user = checkAuth(context);

             try{
                 const post = await Post.findById(postId);
                 if(user.username === post.username){
                     await post.delete();
                     return 'Post Deleted Successfully';
                    
                 }
                 else{
                     throw new AuthenticationError('Action not allowed')
                 }
             }catch(err){
                 throw new Error(err);
             }
         },
         async likePost(_, { postId }, context){
             const { username } = checkAuth(context);

             const post = await Post.findById(postId);
             if(post){
             if(post.likes.find(like => like.username === username)){

                post.likes = post.likes.filter(like => like.username !== username);
                
             }else{
                 post.likes.push({
                     username,
                     createdAt: new Date().toLocaleString()
                 })
                }
             await post.save();
             return post;
             
         }else throw new UserInputError('Post not found');
         }
         
     }, 
     Subscription: {
         newPost: {
             subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
         }
     }
};