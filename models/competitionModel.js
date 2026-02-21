const db = require('../config/db')

exports.createCompetition = async(data)=>{

 const camp = await db.query(

`INSERT INTO camps
(title,tagline,description,category,type,organizer_id)
VALUES ($1,$2,$3,$4,'competition',$5)
RETURNING id`,
[data.title,data.tagline,data.description,data.category,data.organizer_id]

)

 const campId = camp.rows[0].id
 await db.query(
`INSERT INTO competition_details
(camp_id,competition_format,registration_type,prize,max_participants,eligibility,application_link,poster_url)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,

[campId,data.competition_format,data.registration_type,data.prize,data.max_participants,data.eligibility,data.application_link,data.poster_url]
 )

 return campId

}
