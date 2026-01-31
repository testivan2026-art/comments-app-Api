import { Comment, User, File, sequelize } from '../models/index.js';

/**
 * CREATE comment
 * User створюється або береться по email
 */
export const createComment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { email, username, text, parent_id } = req.body;

    if (!email || !username || !text) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'email, username and text are required',
      });
    }

    // 1️⃣ find or create user
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { username },
      transaction,
    });

    // 2️⃣ create comment
    const comment = await Comment.create(
      {
        text,
        parent_id: parent_id || null,
        user_id: user.id,
      },
      { transaction }
    );

    // 3️⃣ attach files (if exist)
    if (req.files && req.files.length > 0) {
      const filesData = req.files.map(file => ({
        filename: file.filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
        comment_id: comment.id,
      }));

      await File.bulkCreate(filesData, { transaction });
    }

    await transaction.commit();

    // 4️⃣ return created comment with relations
    const result = await Comment.findByPk(comment.id, {
      include: [
        { model: User },
        { model: File },
      ],
    });

    res.status(201).json(result);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

/**
 * READ all root comments
 * - pagination
 * - sorting
 * - replies
 * - users + files
 */
export const getComments = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1)

    // Перевірка валідності
    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        message: 'Invalid page parameter',
      })
    }

    const limit = Number(req.query.limit) || 25
    const offset = (page - 1) * limit

    const sortBy = req.query.sortBy || 'date'; // 'date' | 'username' | 'email'
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC'

    let orderOption
    switch (sortBy) {
      case 'username':
        orderOption = [[User, 'username', order]]
        break
      case 'email':
        orderOption = [[User, 'email', order]]
        break
      default:
        orderOption = [['created_at', order]]
    }

    const { count, rows } = await Comment.findAndCountAll({
      where: { parent_id: null },
      limit,
      offset,
      order: orderOption,
      include: [
        { model: User },
        { model: File },
        {
          model: Comment,
          as: 'replies',
          include: [
            { model: User },
            { model: File },
          ],
        },
      ],
    })

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      comments: rows,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
/**
 * READ single comment by id
 */
export const getComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: File },
        {
          model: Comment,
          as: 'replies',
          include: [
            { model: User },
            { model: File },
          ],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE comment
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.update({
      text: req.body.text ?? comment.text,
    });

    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE comment
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * READ files for specific comment
 */
export const getCommentFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      where: { comment_id: req.params.id },
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};