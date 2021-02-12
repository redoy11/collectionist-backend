require('dotenv').config()

var express = require('express');
const Pool = require('pg').Pool;


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// list the repos based on users
const getRepos = (request, response) => {
  const user_id = parseInt(request.params.user);

  pool.query('SELECT * FROM repos WHERE user_id = $1 ORDER BY id ASC', [user_id],  (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// assign a repo to a collection
const assignRepo = (request, response) => {
  const user_id = parseInt(request.params.user);
  const { repo_id, collection_id } = request.body;

  pool.query('DELETE FROM repos WHERE repo_id = $1 and user_id = $2', [repo_id, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    pool.query('INSERT INTO repos (repo_id, collection_id, user_id, created_at, updated_at ) VALUES ($1, $2, $3, now(), now()) returning *', [repo_id, collection_id, user_id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows);
    });
  });
};

// remove assigned repo from a collection
const deleteAssignRepo = (request, response) => {
  const user_id = parseInt(request.params.user);
  const repo_id = parseInt(request.params.id);

  pool.query('DELETE FROM repos WHERE repo_id = $1 and user_id = $2', [repo_id, user_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Assignment deleted for ID: ${repo_id}`);
  });
};

var router = express.Router();

router.get('/:user', getRepos);
router.post('/:user', assignRepo);
router.delete('/:user/:id', deleteAssignRepo);

module.exports = router;