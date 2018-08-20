var jwt = require('jsonwebtoken');
var itemModel = require('../model/itemModel');

class Controller {
    static createItem ( req, res ) {
        let token = req.headers.token
        jwt.verify(token, 'secret', ( err, decoded ) => {
            if ( err || decoded == false ) {
                res
                .status(400)
                .json({
                    err,
                    msg: 'you have to login to create item'
                })
            }else{
                itemModel.create({
                    name: req.body.name,
                    price: req.body.price,
                    stock: req.body.stock,
                    tags: req.body.tags.split(' ')
                }, ( err, data ) => {
                    if (err) {
                        res
                        .status(500)
                        .json({
                            eror: 'you are not authorized to access this API'
                        })
                    }else{
                        res
                        .status(201)
                        .json({
                            _id: data._id,
                            name: data.name,
                            price: data.price,
                            stock: data.stock,
                            tags: data.tags,
                            user: decoded._id
                        })
                    }
                })
            }
        })
    }

    static getItem ( req, res ) {
        itemModel.find({}, (err, data) => {
            if (err ) {
                res
                .status(500)
                .json({
                    err
                })
            }else{
                res
                .status(200)
                .json(data)
            }
        })
    }

    static find ( req, res ) {
        Recipe.find({$or: [{name: new RegExp(req.params.q, 'i')},
        {stock: new RegExp(req.params.q, 'i')},
        {description: new RegExp(req.params.q, 'i')}]
        })
        .then(recipes => {
        res.status(201).json(recipes)
        })
        .catch(err => {
        res.status(400).json(err.message)
        })
    }

}

module.exports = Controller