const { response } = require("express");
const userHelper = require("../helper/userHelper");
const { PDFDocument } = require('pdf-lib');
const pdf = require('pdf-parse');
const axios = require('axios');
const { extractPages } = require('pdf-extraction');

module.exports = {

    registerUser: async (req, res) => {
        try {
           
            const response = await userHelper.signup(req.body);
            console.log(response);

            if (response.emailExist) {
                res.json({message:'Email already exists'});
            } else if (response.phoneExist) {
                res.json({message:'Phone number already exists'});
            } else if (response.usercreated) {
                const UserData=response.usercreated
                console.log(UserData,'register');
                const userId = response.usercreated._id;
                const username = response.usercreated.username;

                const token = await userHelper.createToken(userId.toString(), username);

                res.json({status:true,message:"User registerd",UserData,token})
            } else {
                res.json({status:false,UserData})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    loginUser: async (req, res) => {
        try {
            const response = await userHelper.forlogin(req.body);
            if (response.login && response.userExist) {
                const userData=response.userExist
                const userId = response.userExist._id;
                const username = response.userExist.username;

                const token = await userHelper.createToken(userId.toString(), username);
                
                res.json({status:true,userData,token});
            } else {
                res.json({status:false})
            }
        } catch (error) {
            console.log('Internal Server Error');
            res.status(500).send('Internal Server Error');
        }
    },


    uploadpdf:async (req, res) => {
        try {
            const{userId,title,Extracted}=req.body
            console.log(req.body,"sssssssssssssssssss");
            const fileUrl = req.file.filename; // Get the uploaded file name from Multer
            
          const response = userHelper.pdfUpload(userId,title,Extracted,fileUrl);
          if(response.status==true){
            const pdfData=response.newPdf
            res.json({status:true,pdfData})
          }else{
            res.json({status:false})
          }
        } catch (error) {
          console.error('Error uploading PDF:', error);
          res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
      },

      fetchpdf:async(req,res)=>{
        try {
           const {userId}=req.params
            userHelper.getAllPdf(userId).then((response)=>{
                if(response.status===true){
                    const pdfList=response.pdfList
                    res.json({status:true,pdfList})
                }else{
                    res.json({status:false})
                }
            })
        } catch (error) {
            
        }
      },

      fetchExtracted:async(req,res)=>{
        try {
           const {userId}=req.params
            userHelper.getAllExtractedPdf(userId).then((response)=>{
                if(response.status===true){
                    const ExtractedpdfList=response.ExtractedpdfList
                    res.json({status:true,ExtractedpdfList})
                }else{
                    res.json({status:false})
                }
            })
        } catch (error) {
            console.log(error);
        }
      },

      deletepdf: async (req, res) => {
        try {
            const { pdfId } = req.params;
    
            const response = await userHelper.deletepdf(pdfId);
    
            if (response) {
                res.json({ status: true, message: 'PDF deleted' });
            } else {
                res.json({ status: false, message: 'PDF not found or could not be deleted' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },

    extractpdf: async (req, res) => {
        const { pdfUrl, selectedPages } = req.body;
    
        try {
          const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
          const dataBuffer = Buffer.from(response.data);
    
          const data = await pdf(dataBuffer);
    
          const extractedPages = selectedPages.map((page) => {
            return {
              page,
              content: data.text ? data.text[page - 1] : '',
            };
          });
    
          res.json({ success: true, extractedPages });
        } catch (error) {
          console.error('Extraction error:', error);
          res.status(500).json({ success: false, error: 'Extraction failed' });
        }
      },
      
};
