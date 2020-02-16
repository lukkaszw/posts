const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
  if(req.user) {
   return res.redirect('/');
  }
  res.redirect('/auth/failure');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;