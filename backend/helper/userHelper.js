const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User=require('../model/userSchema')
const Pdf=require('../model/pdfSchema')


module.exports={

    createToken: async (userId, username) => {

        const JWT_SECRET = process.env.JWT_SECRET;

        if (JWT_SECRET) {
            const token = jwt.sign({ id: userId, username: username }, JWT_SECRET, {
                expiresIn: '30d',
            });
            return token;
        } else {
            throw new Error('JWT TOKEN is not defined');
        }
    },

    signup: async (userdata) => {
        try {
            const emailExist = await User.findOne({ email: userdata.email });
            if (emailExist) {
                return { emailExist: true };
            }

            const phoneExist = await User.findOne({ phone: userdata.phone });
            if (phoneExist) {
                return { phoneExist: true };
            }

            const password = await bcrypt.hash(userdata.password, 10);
            const user = new User({
                username: userdata.username,
                email: userdata.email,
                phone: userdata.phone,
                password: password,
            });

            const usercreated = await user.save();
            return { existinguser: false, password: true, usercreated };
        } catch (error) {
            console.error(error);
            throw new Error('Error in signup process.');
        }
    },

    forlogin: async (loginData) => {
        try {
            let userExist = await User.findOne({ email: loginData.email });
            if (!userExist) {
                return { login: false };
            } else {
                let checkPassword = await bcrypt.compare(loginData.password, userExist.password);
                if (checkPassword) {
                    return { login: true, userExist };
                } else {
                    return { login: false };
                }
            }
        } catch (error) {
            console.log('Internal Server Error');
            throw new Error('Internal Server Error');
        }
    },

     pdfUpload :(userId,title,Extracted,fileUrl) => {
        try {
         
          // Create a new PDF document
          const newPdf = new Pdf({
            userId: userId,
            title: title,
            Extracted:Extracted,
            url: fileUrl,
        });
          
          newPdf.save();
          return { status: true, message: 'PDF uploaded successfully',newPdf};
        } catch (error) {
          return { status: false, message: 'Error uploading PDF' };
        }
      
},

getAllPdf: async (userId) => {
    try {
      const pdfList = await Pdf.find({ userId: userId, Extracted: false });
    
      return { status: true, message: 'PDFs retrieved successfully', pdfList };
    } catch (error) {
      console.error('Error retrieving PDFs:', error);
      return { status: false, message: 'Error retrieving PDFs' };
    }  
  },

  getAllExtractedPdf:async (userId) => {
    try {
      const ExtractedpdfList = await Pdf.find({ userId: userId, Extracted: true });
    
      return { status: true, message: 'PDFs retrieved successfully', ExtractedpdfList };
    } catch (error) {
      console.error('Error retrieving PDFs:', error);
      return { status: false, message: 'Error retrieving PDFs' };
    }  
  },

  deletepdf: async (pdfId) => {
    try {
        const result = await Pdf.deleteOne({ _id: pdfId });

        if (result.deletedCount > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
  
}