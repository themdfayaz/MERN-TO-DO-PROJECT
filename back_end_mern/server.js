const express=require("express") ;
const app=express();
const mongoose=require("mongoose"); 
const cors=require("cors");


app.use(express.json());
app.use(cors());
//connecting mongo DB
mongoose.connect('mongodb://localhost:27017/mern-app').then(
    ()=>{
        console.log("DB Connected");
    }
).catch(()=>{
    console.log("DB Error");
}) 

//Creating schemas
 const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String},
    description:String
 })
 
 //Creating Model
 const todoModel=mongoose.model('Todo',todoSchema);

 //creating items
 app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
try {
    const newTodo=new todoModel({title,description})
    await newTodo.save();
    res.status(200).json(newTodo)
} catch (error) {
    console.log(error);
    res.status(500).json({message:error.message} )
    
}

   
 })
//Get all iterms
app.get('/todos',async (req,res)=>{
    try {
        const todos=await todoModel.find()
        res.json(todos)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
})

//update a todo item
 app.put('/todos/:id',async (req,res)=>{
    try {
        const {title,description}=req.body;
    const id=req.params.id;
   const updatedTodo= await todoModel.findByIdAndUpdate(
        id,{title,description},
       { new:true} )
        if(!updatedTodo){
            return res.status(404).json({message:"Item Not Found"})
        }
        res.json(updatedTodo)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
 })

//Delete an item
app.delete('/todos/:id',async (req,res)=>{
    try {
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id)
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
  
})
app.listen(4000,()=>{     
    console.log("server is running");}
) 