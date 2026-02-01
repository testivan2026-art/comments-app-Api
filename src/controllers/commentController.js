import { Comment, User, File, sequelize } from '../models/index.js'

export const createComment = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { email, username, text, parent_id } = req.body

    if (!email || !username || !text) {
      await transaction.rollback()
      return res.status(400).json({
        message: 'email, username and text are required'
      })
    }

    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { username },
      transaction
    })

    const comment = await Comment.create(
      {
        text,
        parent_id: parent_id || null,
        user_id: user.id
      },
      { transaction }
    )

    // якщо файл є (тільки для /with-file)
    if (req.file) {
      await File.create({
        comment_id: comment.id,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }, { transaction })
    }

    await transaction.commit()

    const result = await Comment.findByPk(comment.id, {
      include: [{ model: User }, { model: File }]
    })

    res.status(201).json(result)

  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ message: error.message })
  }
}

// ---------------- READ ----------------

export const getComments = async (req, res) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 25)
    const offset = (page - 1) * limit

    const { count, rows } = await Comment.findAndCountAll({
      where: { parent_id: null },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        { model: User },
        { model: File },
        {
          model: Comment,
          as: 'replies',
          include: [{ model: User }, { model: File }]
        }
      ]
    })

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      comments: rows
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getComment = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' })
  }
  res.json(comment)
}

export const updateComment = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' })
  }

  await comment.update({ text: req.body.text })
  res.json(comment)
}

export const deleteComment = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' })
  }

  await comment.destroy()
  res.json({ message: 'Comment deleted' })
}

export const getCommentFiles = async (req, res) => {
  const files = await File.findAll({
    where: { comment_id: req.params.id }
  })
  res.json(files)
}