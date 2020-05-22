const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie');

router.get('/', async (req, res) =>{
    const movies = await Movie
        .find()
        .sort('name')

    res.send(movies);
})

router.get('/:id', async (req, res) => {

    const movie = await Movie
    .find({_id:req.params.id});

    if (!movie) res.status(404).send("No movie found for that ID...");

    res.send(movie);

})

router.post('/', async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    
    if(!genre) return res.status(400).send('Invalid genre given...')

    const movie = new Movie({
        title:req.body.title,
        genre:{
            _id: genre._id,
            name: genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    })

    await movie.save();

    res.send(movie);
})

router.put('/:id', async (req, res)=>{

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    
    if(!genre) return res.status(400).send('Invalid genre given...')

    let movie = await Movie.findByIdAndUpdate(req.params.id,{
        $set:{
            title:req.body.title,
            genre:{
                _id: genre._id,
                name: genre.name
            },
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate
        }
    }, {new:true})

    if (!movie) return res.status(404).send("No movie found for that ID...");

    res.send(movie);

})

router.delete('/:id', async (req, res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) res.status(404).send("No movie found for that ID...");

    res.send(movie);
})

module.exports = router;