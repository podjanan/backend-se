const db = require('../config/db')


// approve
exports.approveCamp = async(req,res)=>{
 try{
  const {id} = req.params
  await db.query(`UPDATE camps SET approval_status='approved' WHERE id=$1`,[id])
    res.json("Camp approved")
    }catch(err){
        res.status(500).json(err.message)
 }
}



// reject
exports.rejectCamp = async(req,res)=>{
 try{
    const {id} = req.params
    await db.query(`UPDATE campsSET approval_status='rejected'WHERE id=$1`,[id])
    res.json("Camp rejected")
}catch(err){
    res.status(500).json(err.message)
}
}



// change camp status
exports.updateCampStatus = async(req,res)=>{
 try{
    const {id} = req.params
    const {camp_status} = req.body
    await db.query(`UPDATE camps SET camp_status=$1 WHERE id=$2`,[camp_status,id])
    res.json("Camp status updated")
 }catch(err){
    res.status(500).json(err.message)
}

}

// get all camps
exports.getAllCamps = async(req,res)=>{
    try{
        const result = await db.query(`SELECT * FROM camps ORDER BY created_at DESC`)
        res.json(result.rows)
    }catch(err){
        res.status(500).json(err.message)
 }
}
