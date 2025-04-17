const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')

const app = express()
const port = 4001
const db = new sqlite3.Database('memories.db')

app.use(cors())
app.use(express.json({ limit: '50mb' }))

const AVAILABLE_TAGS = ['cooking', 'traveling', 'outdoors'];

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      timestamp DATE,
      image TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS memory_tags (
      memory_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
      PRIMARY KEY (memory_id, tag_id)
    )
  `)

  AVAILABLE_TAGS.forEach(tagName => {
    db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName])
  })
})

app.get('/tags', (req, res) => {
  db.all('SELECT * FROM tags', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

app.get('/memories', (req, res) => {
  const query = `
    SELECT 
      m.*,
      GROUP_CONCAT(t.name) as tags
    FROM memories m
    LEFT JOIN memory_tags mt ON m.id = mt.memory_id
    LEFT JOIN tags t ON mt.tag_id = t.id
    GROUP BY m.id
  `
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    
    const memories = rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : []
    }))
    
    res.json(memories)
  })
})

app.post('/memories', (req, res) => {
  const { name, description, timestamp, image, tags } = req.body

  if (!name || !description || !timestamp || !image) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp, image',
    })
    return
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION')

    const stmt = db.prepare(
      'INSERT INTO memories (name, description, timestamp, image) VALUES (?, ?, ?, ?)'
    )
    
    stmt.run(name, description, timestamp, image, function(err) {
      if (err) {
        db.run('ROLLBACK')
        res.status(500).json({ error: err.message })
        return
      }

      const memoryId = this.lastID

      if (tags && tags.length > 0) {
        const tagStmt = db.prepare(
          'INSERT INTO memory_tags (memory_id, tag_id) SELECT ?, id FROM tags WHERE name = ?'
        )

        let tagError = null

        for (const tag of tags) {
          tagStmt.run(memoryId, tag, (err) => {
            if (err && !tagError) tagError = err
          })
        }

        tagStmt.finalize((err) => {
          if (err || tagError) {
            db.run('ROLLBACK')
            res.status(500).json({ error: (err || tagError).message })
            return
          }

          db.run('COMMIT')
          res.status(201).json({ message: 'Memory created successfully', id: memoryId })
        })
      } else {
        db.run('COMMIT')
        res.status(201).json({ message: 'Memory created successfully', id: memoryId })
      }
    })
  })
})

app.get('/memories/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' })
      return
    }
    res.json({ memory: row })
  })
})

app.put('/memories/:id', (req, res) => {
  const { id } = req.params
  const { name, description, timestamp, image, tags } = req.body

  if (!name || !description || !timestamp || !image) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp, image',
    })
    return
  }

  if (tags && tags.length > 3) {
    res.status(400).json({
      error: 'A memory can have at most 3 tags',
    })
    return
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION')

    const stmt = db.prepare(
      'UPDATE memories SET name = ?, description = ?, timestamp = ?, image = ? WHERE id = ?'
    )
    
    stmt.run(name, description, timestamp, image, id, (err) => {
      if (err) {
        db.run('ROLLBACK')
        res.status(500).json({ error: err.message })
        return
      }

      db.run('DELETE FROM memory_tags WHERE memory_id = ?', [id], (err) => {
        if (err) {
          db.run('ROLLBACK')
          res.status(500).json({ error: err.message })
          return
        }

        if (tags && tags.length > 0) {
          const tagStmt = db.prepare(
            'INSERT INTO memory_tags (memory_id, tag_id) SELECT ?, id FROM tags WHERE name = ?'
          )

          let tagError = null

          for (const tag of tags) {
            tagStmt.run(id, tag, (err) => {
              if (err && !tagError) tagError = err
            })
          }

          tagStmt.finalize((err) => {
            if (err || tagError) {
              db.run('ROLLBACK')
              res.status(500).json({ error: (err || tagError).message })
              return
            }

            db.run('COMMIT')
            res.json({ message: 'Memory updated successfully' })
          })
        } else {
          db.run('COMMIT')
          res.json({ message: 'Memory updated successfully' })
        }
      })
    })
  })
})

app.delete('/memories/:id', (req, res) => {
  const { id } = req.params
  db.serialize(() => {
    db.run('BEGIN TRANSACTION')
    
    db.run('DELETE FROM memory_tags WHERE memory_id = ?', [id], (err) => {
      if (err) {
        db.run('ROLLBACK')
        res.status(500).json({ error: err.message })
        return
      }
      
      db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
        if (err) {
          db.run('ROLLBACK')
          res.status(500).json({ error: err.message })
          return
        }
        
        db.run('COMMIT')
        res.json({ message: 'Memory deleted successfully' })
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
