const db = require('../../config/db');
const bcrypt = require('bcrypt')
const validations = require('../helpers/validations')


exports.register = async (req, res) => {
    
        // Extract data from the request body
        const { username, email, password, confirm_password, firstname, lastname, birthdate } = req.body;

        const errors = {}
        validations.validateName(firstname, lastname, errors);
        validations.validatePassword(password, confirm_password, errors)
        validations.validateEmail(email, errors)
        const isEmpty = Object.keys(errors).length === 0;


        // Validate email format (add more validation if needed)
        if (isEmpty) {    
        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user data into the database
        const insertedUser = await db.transaction(async (trx) => {
            const [user] = await trx
                .insert({
                    username,
                    password: password_hash,
                    email,
                    firstname,
                    lastname,
                    birthdate,
                })
                .into('user')
                .returning('*')
            return user;
        });
        res.status(201).json({ message: 'Registration successful', user: insertedUser });
        }
           
        else {
        res.status(400).json(errors)
        }
    
}



exports.getUserById = (req, res) => {

    const {userid} = req.params;

    db.select('*')
        .from('user')
        .where({userid: userid})
        .then((data) => {
            // Return the scholarship data retrieved from the database
            if (data.length === 0) {
                return res.status(404).json({message: 'user not found'});
            }
            res.status(200).json(data[0]);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        });

}


// exports.login = (req, res) => {
//     // Extract data from the request body
//     const {email, password} = req.body;

//     // Check if all required fields are present
//     if (!email || !password) {
//         res.status(400).json({error: 'All fields are required'});
//     }

//     db.select('scholarship_finder.users.id',
//         'scholarship_finder.users.name',
//         'scholarship_finder.users.email',
//         'scholarship_finder.users.password')
//         .from('scholarship_finder.users')
//         .where('email', '=', email)
//         .then(async (data) => {
//             const pass = data.length > 0 ? data[0].password : '';
//             const isValid = await bcrypt.compareSync(password, pass);
//             // Return success message
//             if (isValid) {
//                 const responseData = {
//                     id: data[0].id,
//                     name: data[0].name,
//                     email: data[0].email
//                 };
//                 res.status(200).json(responseData);
//             } else {
//                 // console.log(error);
//                 res.status(400).json({error: 'Password is not valid'});
//             }
//         }).catch((error) => {
//         console.log(error)
//         res.status(500).json(error)
//     })
// }