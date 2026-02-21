const campModel = require('../models/campModel')

exports.createCamp = async(req,res)=>{

 try{

  const result = await campModel.createCamp({
   organizer_id: req.user.id,
   title: req.body.title,
   tagline: req.body.tagline,
   category: req.body.category,
   description: req.body.description,
   event_date: req.body.event_date,
   event_format: req.body.event_format,
   location: req.body.location,
   max_participants: req.body.max_participants,
   price: req.body.price,
   eligibility: req.body.eligibility,
   contact_name: req.body.contact_name,
   contact_email: req.body.contact_email,
   contact_phone: req.body.contact_phone,
   organizer_name: req.body.organizer_name,
   application_link: req.body.application_link,
   poster_url: req.body.poster_url,
   headline_image_url: req.body.headline_image_url
  })
  res.json(result.rows[0])
 }catch(err){
  res.status(500).json(err.message)

 }

}
