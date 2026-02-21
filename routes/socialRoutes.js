const router = require('express').Router()

const db = require('../config/db')

// create social links
router.post('/', async (req,res)=>{
 try{

  const {camp_id,facebook,instagram,twitter,website,youtube,discord,tiktok} = req.body
    await db.query(
    `INSERT INTO social_links
    (camp_id,facebook,instagram,twitter,website,youtube,discord,tiktok)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [camp_id,facebook,instagram,twitter,website,youtube,discord,tiktok] )
        res.json("Social links added")
    }catch(err){
  res.status(500).json(err.message)
 }
})

module.exports = router
