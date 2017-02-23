'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
  knex('classifieds')
  .select('id', 'title', 'description', 'price', 'item_image')
  .then((results) => {
    res.send(200, results);
  })
  .catch ((err) => {
    next(err);
  });
});

router.get('/:id', (req, res, next) => {
  let ad_id = req.params.id;

  knex('classifieds')
  .where({
    id: ad_id
  })
  .select('id', 'title', 'description', 'price', 'item_image')
  .then((results) => {
    res.send(200, results[0]);
  })
  .catch ((err) => {
    next(err);
  });
});

router.post('/', (req,res, next) => {
  knex('classifieds')
    .insert({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      item_image: req.body.item_image,
    }, ['id', 'title', 'description', 'price', 'item_image'])
    .then((result) => {
      res.send(result[0]);
    })
    .catch((err)=>{
      res.send(err);
    });
});


router.patch('/:id', (req, res, next) => {
  knex('classifieds')
  .update({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    item_image: req.body.item_image,
  }, ['id', 'title', 'description', 'price', 'item_image'])
  .where({id: req.params.id})
  .then((result) => {
    res.send(result[0]);
  })
  .catch((err)=>{
    res.send(err);
  });
});


router.delete('/:id/', (req, res, next) => {
  knex('classifieds')
    .where('id', req.params.id)
    .then((result) => {
      const post = result[0];
      knex('classifieds')
        .where('id', req.params.id)
        .del()
        .then(() => {
          delete result[0].created_at;
          delete result[0].updated_at;
          res.send(post);
        });
    });
});

module.exports = router;
