require('dotenv').config()

var express = require('express');
const Pool = require('pg').Pool;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const getCollections = (request, response) => {
  const user_id = parseInt(request.params.user);

  pool.query('SELECT * FROM collections WHERE user_id = $1 ORDER BY id ASC', [user_id],  (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCollectionById = (request, response) => {
  const user_id = parseInt(request.params.user);
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM collections WHERE user_id = $1 and id = $2', [user_id, id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createCollection = (request, response) => {
  const user_id = parseInt(request.params.user);
  const { title } = request.body;

  pool.query('INSERT INTO collections (title, user_id, created_at, updated_at ) VALUES ($1, $2, now(), now()) returning *', [title, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).json(results.rows);
  });
};

const updateCollection = (request, response) => {
  const id = parseInt(request.params.id);
  const user_id = parseInt(request.params.user);
  const { title } = request.body;

  pool.query(
    'UPDATE collections SET title = $1, updated_at = now() WHERE user_id = $2 and id = $3 returning *',
    [title, user_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const deleteCollection = (request, response) => {
  const user_id = parseInt(request.params.user);
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM collections WHERE id = $1 and user_id = $2', [id, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Collection deleted with ID: ${id}`);
  });
};

var router = express.Router();

router.get('/:user', getCollections);
router.get('/:user/:id', getCollectionById);
router.post('/:user', createCollection);
router.put('/:user/:id', updateCollection);
router.delete('/:user/:id', deleteCollection);

module.exports = router;