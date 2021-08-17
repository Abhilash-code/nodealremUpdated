const jwt = require('express-jwt');
const { secret } = require('../nodemon.json');
const db = require('../models');


module.exports = authorize;

function authorize() {
    return [

        jwt({ secret, algorithms: ['HS256'] }),


        async (req, res, next) => {

            const user = await db.csrUsers.findByPk(req.user.sub);

            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}
