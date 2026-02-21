const competitionModel = require('../models/competitionModel')

exports.createCompetition = async(req,res)=>{

 try{
    const id = await competitionModel.createCompetition({
        organizer_id:req.user.id,
        title:req.body.title,
        tagline:req.body.tagline,
        description:req.body.description,
        category:req.body.category,
        competition_format:req.body.competition_format,
        registration_type:req.body.registration_type,
        prize:req.body.prize,
        max_participants:req.body.max_participants,
        eligibility:req.body.eligibility,
        application_link:req.body.application_link,
        poster_url:req.body.poster_url

  })
    res.json({message:"Competition created",id})

 }catch(err){
    res.status(500).json(err.message)
}

}
