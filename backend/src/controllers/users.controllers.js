const db = require('../../config/db');
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
    // Extract data from the request body
    const {username, email, password, firstname, lastname, birthdate} = req.body;

    // Check if all required fields are present
    if (!username || !email || !password || !firstname || !lastname || !birthdate) {
        res.status(400).json({error: 'All fields are required'});
    }
    const password_hash = await bcrypt.hashSync(password, 10)

    await db.transaction(trx => {
        trx.insert({username: username, email: email, password: password_hash, firstname: firstname, lastname:lastname, birthdate: birthdate})
            .into('public.user').returning('*')
            .then((res) => res.send("successfully ..."))
            .catch(() => res.status(409).json({message: 'something is Wrong ...'}))
    })
}



exports.getUserById = (req, res) => {

    const {userid} = req.params;
    // res.send("here is the id : "+ userid);

    db.select('*')
        .from('user')
        .where({userid: 0})
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