const Product = require('../models/product');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { parseInt } = require('lodash');

//Param
exports.getProductById = (req, res, next, id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err, product)=>{
        if(err){
            return res.status(400).json({
                error: "Product not found in DB"
            });
        }
        req.product = product;
        next();
    })
}

//CONTROLLERS

//create controllers
exports.createProduct= (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with img"
            });
        }

        //destructure the fields
        const {name, description, price, category, stock} = fields;

        //I wanna work on this with check validation 
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let product = new Product(fields)

        //handle file here 
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size is to big"
                })
            } 
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }


        //Save to the DB
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error: "Fail to save the img"
                });
            }
            res.json(product)
        })
    })
};

exports.getProduct = (req, res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}

//delete controllers
exports.deleteProduct = (req, res)=>{
    let product = req.product;
    product.remove((err, deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message: "Deletion was a success",
            deletedProduct
        })
    })
}

//update controllers
exports.updateProduct = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with img"
            });
        }

        //update 
        let product = req.product;
        product = _.extend(product, fields)

        //handle file here 
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size is to big"
                })
            } 
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }


        //Save to the DB
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error: "Fail to update the img"
                });
            }
            res.json(product)
        })
    })
}

exports.getAllProducts = (req, res)=>{
    let limit= req.query.limit? parseInt(req.query.limit) : 8;
    let sortBy= req.query.sortBy? parseInt(req.query.sortBy) : "_id";


    Product.find()
    .select("-photo")
    .populate("Category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error: "No product Found"
            })
        }
        res.json(products);
    })
}

exports.getAllUniqueCategories = (req, res)=>{
    Product.distinct("category", {},  (err, category)=>{
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(category);
    })
}

// MIDDLEWARES
exports.photo = (req, res, next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.updateStock = (req, res, next)=>{
    let myOperations = req.body.order.products.map(prod=>{
        return{
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products)=>{
        if(err){
            return res.status(400).json({
                error:"bulk opration fail"
            })
        }

        next();
    })
    next()
}


