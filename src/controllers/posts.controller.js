const Post = require('../models/post');

const getAll = async (req, res) => {
  const { skip, limit } = req.query;
  try {
    const allActivePosts = await Post.find({ status:  { $ne: 'draft' }});
    const count = allActivePosts.length;
    const posts = await Post
      .find({ status:  { $ne: 'draft' }})
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ updatedAt: -1 });

   if(!posts) {
     res.status(404).json({
       error: {
        message: '404 not found',
       },
     });
     return;
   }
   const data = {
     posts,
     count,
   }

   if(req.user) {
     data.user = {
       email: req.user.emails[0].value,
     }
   }

   res.json(data);
  } catch(error) {
    res.status(500).json({
      error,
    });
  }
};


const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post) {
      res.status(404).json({
        error: {
          message: '404 - not found',
        },
      })
      return;
    }
    res.json({ 
      post, 
    });
  } catch(error) {
    res.status(500).json({
      error,
    });
  }
}

const getMyPosts = async (req, res) => {
  const { skip, limit } = req.query;
  try {
    const allMyPosts = await Post.find({ author: { $eq: req.userEmail  }});
    const count = allMyPosts.length;
    const posts = await Post
      .find({ author: { $eq: req.userEmail }})
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ updatedAt: -1 });
    if(!posts) {
      res.status(404).json({
        error: {
          message: '404 - Not found!',
        }
      });
      return;
    }
    res.json({
      posts,
      count,
    })
  } catch (error) {

  }
}


const postOne = async (req, res) => {
  if(req.userEmail !== req.body.author) {
    res.status(401).json({
      error: {
        message: 'Unauthorized client!',
      },
    });
    return;
  }
  try {
    const post = new Post({...req.body});
    await post.save();
    res.status(201).json({
      post,
    })
  } catch(error) {
    res.status(400).json({
      error,
    });
  }
}

const putOne = async (req, res) => {
  const allowedUpdates = ['title', 'imageUrl', 'content', 'author', 'price', 'phone', 'localization', 'status'];
  const requestedUpdates = Object.keys(req.body);
  const isAllowed = requestedUpdates.every(option => allowedUpdates.includes(option));
  if(!isAllowed) {
    res.status(400).json({
      error: {
        message: 'Bad request!',
      }
    })
    return;
  }

  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post) {
      res.status(404).json({
        error: {
          message: '404 - post not found',
        }
      });
    }

    if(post.author !== req.userEmail) {
      res.stats(401).json({
        error: {
          message: 'Unauthorized client!',
        }
      });
    }

    requestedUpdates.forEach(update => {
      post[update] = req.body[update];
    });
    await post.save();
    res.json({
      post
    })
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}





module.exports = {
  getAll,
  getOne,
  postOne,
  putOne,
  getMyPosts,
};