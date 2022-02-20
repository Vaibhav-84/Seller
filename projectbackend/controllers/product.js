const Product = require('../models/product');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


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
