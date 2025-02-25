const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, vaidateLoginInput } = require('../../util/Validators')


function generateToken(user){
   return jwt.sign(
        {
        id: user.id,
        email: user.email,
        username: user.username
    },
     SECRET_KEY,
     { expiresIn: '1h' }
     );
}



module.exports = {
    Mutation: {
        async login(_, { username, password }){
          const {errors, valid} = vaidateLoginInput(username, password);

          if(!valid){
              throw new UserInputError('Errors', { errors })
          }
          const user = await User.findOne({ username });

          if(!user){
              errors.general = 'User not Found';
              throw new UserInputrError('User not Found', { errors });
          }
          const match = await bcrypt.compare(password, user.password);
          if(!match){
            errors.general = 'Wrong credentials';
            throw new UserInputrError('Wrong credentials', { errors });
          }
          const token = generateToken(user);
          return {
            ...user._doc,
            id: user._id,
            token
        };

        },


        async register(_,
             {
                  registerInput : { username, email, password, confirmPassword }
            }
            ){
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username : 'This username is taken'
                    }
                })
            }
                
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toLocaleString()
            });

            const res = await newUser.save();

            const token = generateToken(res);
            
            return {
                ...res._doc,
                id: res._id,
                token
            };
        },
        
    }
}