const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const {Rental,validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

router.get('/', async (req, res) =>{
    const rentals = await Rental
        .find()
        .sort('-dateOut')

    res.send(rentals);
})

router.post('/', async (req, res)=>{

    const {error} = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const customer = Customer.findById(req.body.customerId);

    if(!customer) return res.status(400).send('Invalid customer ID...')

    const movie = Movie.findById(req.body.movieId);

    if(!movie) return res.status(400).send('Invalid movie ID...')
    
    let rental = await new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    })

    rental = await rental.save();

    movie.numberInStock--;
    movie.save();

    res.send(rental);
})

router.get('/:id', async (req, res) => {

    const rental = await Rental
    .find({_id:req.params.id});

    if (!rental) res.status(404).send("No rental found for that ID...");

    res.send(rental);

})