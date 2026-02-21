const db = require('../config/db')

exports.createCamp = async(data)=>{

 return db.query(

`INSERT INTO camps

(
organizer_id,
title,
tagline,
category,
description,
event_date,
event_format,
location,
max_participants,
price,
eligibility,
contact_name,
contact_email,
contact_phone,
organizer_name,
application_link,
poster_url,
headline_image_url
)

VALUES

($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)

RETURNING *
`,

[
data.organizer_id,
data.title,
data.tagline,
data.category,
data.description,
data.event_date,
data.event_format,
data.location,
data.max_participants,
data.price,
data.eligibility,
data.contact_name,
data.contact_email,
data.contact_phone,
data.organizer_name,
data.application_link,
data.poster_url,
data.headline_image_url
]

)

}
