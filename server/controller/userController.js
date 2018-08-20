var userModel = require('../model/userModel');
var jwt = require('jsonwebtoken');
var bycrypt = require('bcryptjs');


class Controller {
    static createUser ( req, res ) {
        let hash = bycrypt.hash(req.body.password, 5, ( err, hash ) => {
            if (err) {
                res
                .status(500)
                .json(err)
            }else{
                userModel.create({
                    username: req.body.username,
                    password: hash
                }, ( err, user ) => {
                    if (err) {
                        res
                        .status(500)
                        .json(err)
                    }else{
                        res
                        .status(201)
                        .json({
                            success: true,
                            message: `Account ${user.username} registered`
                        })
                    }
                })
            }
        })
    }

    static signIn ( req, res ) {
        userModel.findOne({ username: req.body.username }, ( err, user ) => {
            if ( err || user == null) {
                res
                .status(500)
                .json(err)
            }else{
                bycrypt.compare(req.body.password, user.password, ( err, success ) => {
                    if ( err || !success) {
                        res
                        .status(400)
                        .json(err)
                        console.log('wrong password')
                    } else {
                        jwt.sign({
                            username: user.username,
                            _id: user._id
                        },'secret', ( err, token ) => {
                            if (err) {
                                res
                                .status(500)
                                .json(err)
                                console.log('jwt error')
                            }else{
                                res
                                .status(201)
                                .json({
                                    token
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}


module.exports = Controller